import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { ensureAuthenticate } from "./middleware/ensureAuthenticate";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";

const router = Router();

/**
 * O método handle recebe o request e o response, porém como estou utilizando dentro
 * da minha rota ele funciona como se fosse um middleware, então por isso eu não preciso
 * passar aqui explicitamente os parametros do request e do response, porque automaticamente
 * o express já faz isso e repassa os parametros para dentro do nosso método.
 */
router.post("/authenticate", new AuthenticateUserController().handle)

router.post("/messages", ensureAuthenticate, new CreateMessageController().handle)

router.get("/messages/last3", new GetLast3MessagesController().handle);

router.get("/profile", ensureAuthenticate, new ProfileUserController().handle);

export { router }