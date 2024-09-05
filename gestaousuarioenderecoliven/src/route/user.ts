import { Router, Request, Response } from 'express';
import { UserController } from '../controller/UserController';
import { AuthController } from '../controller/AuthController';

export const routerUsuario = Router();
const userController = new UserController();
const authController = new AuthController();

routerUsuario.post("/login", (req: Request, res: Response) => authController.login(req, res));

routerUsuario.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await userController.register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(error instanceof ValidationError || error instanceof ConflictError ? 400 : 500).json({ message: error.message });
  }
});

routerUsuario.get("/", authController.verificarToken, async (req: Request, res: Response) => {
  try {
    const users = await userController.recuperarTodos();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

routerUsuario.get("/:id", authController.verificarToken, async (req: Request, res: Response) => {
  try {
    const user = await userController.recuperarPorId(parseInt(req.params.id));
    res.status(200).json(user);
  } catch (error: any) {
    res.status(error instanceof NotFoundError ? 404 : 500).json({ message: error.message });
  }
});

routerUsuario.put("/:id", authController.verificarToken, async (req: Request, res: Response) => {
  try {
    const user = await userController.atualizar(parseInt(req.params.id), req.body);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(error instanceof ValidationError ? 400 : 500).json({ message: error.message });
  }
});

routerUsuario.delete("/:id", authController.verificarToken, async (req: Request, res: Response) => {
  try {
    const result = await userController.remover(parseInt(req.params.id));
    res.status(result ? 200 : 404).json({ success: result });
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

class ValidationError extends Error {}
class ConflictError extends Error {}
class NotFoundError extends Error {}