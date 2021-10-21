import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload{
    sub: string;
}

export function ensureAuthenticate(request: Request, response: Response, next: NextFunction){
    const authToken = request.headers.authorization;

    if (!authToken){
        return response.status(401).json({
            errorCode: "token.invalid",
        });
    }

    /**
     * Estrutura do token dentro do nosso Header "Bearer 89890809809808089"
     * [0] Bearer
     * [1] 89890809809808089
     */
    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload   
        request.user_id = sub;   
        return next();  
    } catch (error) {
        return response.status(401).json({ errorCode: "token.expired"})
    }
}