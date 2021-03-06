import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

interface IAccessTokenReponse{
    access_token: string
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

/**
 * Receber code(string)
 * Recuperar o access_token no github (token que o Github disponibiliza para acessar as inf do nosso usuário) virá do front e do mobile.
 * Recuperar infos do user no github
 * Verificar se o usuário existe no nosso DB | Se sim gera um token, caso não criamos no banco e gera o token
 * Retornamos o token com as infos do user logado
 */
class AuthenticateUserService {
    async execute(code: string){
        const url = "https://github.com/login/oauth/access_token";

        const { data: accessTokenResponse } = await axios.post<IAccessTokenReponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        });

        const response = await axios.get<IUserResponse>("https://api.github.com/user",{
            headers:{
                authorization: `Bearer ${accessTokenResponse.access_token}`,
            },
        });

        const { login, id, avatar_url, name } = response.data;

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        })

        if (!user){
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = sign(
            {
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                },
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        );

        //Quando usa o axios, toda infromação que é retornada é colocada no data
        return { token, user };
    }
}

export { AuthenticateUserService }