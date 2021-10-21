import { Request, Response } from "express"; 
import { CreateMessageService } from "../services/CreateMessageService";

class CreateMessageController {
    async handle(request: Request, response: Response) {
        const { message } = request.body;

        const { user_id } = request;

        const service = new CreateMessageService();

        //console.log(request);

        const result = await service.execute(message, user_id);
        //console.log(result);

        return response.json(result);
    }
}

export { CreateMessageController }