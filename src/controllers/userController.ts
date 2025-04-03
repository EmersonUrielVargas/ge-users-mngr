
import { UserService } from "@services/userService";
import { Router } from "express";

const router = Router();
const userService = new UserService();

const userController = ()=>{
    router.post('/register', async (_req, res, next)=>{
        await userService.registerUser(_req, res, next);
    });

    router.post('/login', async (_req, res, next)=>{
        await userService.loginUser(_req, res, next);
    });

    return router;
}

export default userController;
