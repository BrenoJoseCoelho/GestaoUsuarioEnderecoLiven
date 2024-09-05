import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { AuthController } from '../controller/AuthController';

export const routerUsuario = Router();
const userController = new UserController();
const authController = new AuthController();

routerUsuario.post("/login", (req, res) => authController.login(req, res));

routerUsuario.post("/register",async (req, res) => {
    try {
        const user = await userController.register(req.body);
        res.status(201).json(user);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

routerUsuario.get("",authController.verificarToken ,async (req, res) => {
    try {
        const users = await userController.recuperarTodos();
        res.status(200).json(users);
    } catch (error:any) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


routerUsuario.get("/:id",authController.verificarToken , async (req, res) => {
    try {
        const user = await userController.recuperarPorId(parseInt(req.params.id));
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error:any) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

routerUsuario.put("/:id",authController.verificarToken , async (req, res) => {
    try {
        const user = await userController.atualizar(parseInt(req.params.id), req.body);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});


routerUsuario.delete("/:id",authController.verificarToken , async (req, res) => {
    try {
        const result = await userController.remover(parseInt(req.params.id));
        if (result) {
            res.status(200).json({ success: result });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error:any) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});