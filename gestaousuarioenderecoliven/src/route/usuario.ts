import { Router } from 'express';
import { UserController } from '../controller/UserController';

export const routerUsuario = Router();
const userController = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - cpf
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         cpf:
 *           type: string
 *           description: CPF do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *       example:
 *         id: 1
 *         name: João da Silva
 *         email: joao@example.com
 *         cpf: "123.456.789-00"
 *         password: "senha123"
 */

/**
 * @swagger
 * /usuario/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro na validação dos dados
 */
routerUsuario.post("/register", async (req, res) => {
    try {
        const user = await userController.register(req.body);
        res.status(201).json(user);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /usuario/users:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro interno do servidor
 */
routerUsuario.get("/users", async (req, res) => {
    try {
        const users = await userController.recuperarTodos();
        res.status(200).json(users);
    } catch (error:any) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /usuario/user/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerUsuario.get("/user/:id", async (req, res) => {
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

/**
 * @swagger
 * /usuario/user/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro na validação dos dados
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerUsuario.put("/user/:id", async (req, res) => {
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

/**
 * @swagger
 * /usuario/user/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica se o usuário foi removido com sucesso
 *                   example: true
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerUsuario.delete("/user/:id", async (req, res) => {
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