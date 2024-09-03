import { Router } from 'express';
import { AddressController } from '../controller/AddressController';

export const routerAddres = Router();
const addressController = new AddressController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - city
 *         - state
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do endereço
 *         street:
 *           type: string
 *           description: Rua do endereço
 *         city:
 *           type: string
 *           description: Cidade do endereço
 *         state:
 *           type: string
 *           description: Estado do endereço
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         id: 1
 *         street: "Rua das Flores"
 *         city: "São Paulo"
 *         state: "SP"
 *         user: { id: 1, name: "João da Silva", email: "joao@example.com", cpf: "123.456.789-00" }
 */

/**
 * @swagger
 * /address/user/{userId}/address:
 *   post:
 *     summary: Cria um novo endereço para um usuário
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Endereço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Erro na validação dos dados
 */
routerAddres.post("/user/:userId/address", async (req, res) => {
    try {
        const address = req.body;
        address.user = { id: parseInt(req.params.userId) };
        const savedAddress = await addressController.salvar(address);
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /address/user/{userId}/addresses:
 *   get:
 *     summary: Retorna todos os endereços de um usuário
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de endereços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       500:
 *         description: Erro interno do servidor
 */
routerAddres.get("/user/:userId/addresses", async (req, res) => {
    try {
        const addresses = await addressController.recuperarPorUsuario(parseInt(req.params.userId));
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Retorna um endereço pelo ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Dados do endereço
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerAddres.get("/address/:id", async (req, res) => {
    try {
        const address = await addressController.recuperarPorId(parseInt(req.params.id));
        if (address) {
            res.status(200).json(address);
        } else {
            res.status(404).json({ message: "Address not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /address/{id}:
 *   put:
 *     summary: Atualiza um endereço pelo ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do endereço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Erro na validação dos dados
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerAddres.put("/address/:id", async (req, res) => {
    try {
        const address = await addressController.atualizar(parseInt(req.params.id), req.body);
        if (address) {
            res.status(200).json(address);
        } else {
            res.status(404).json({ message: "Address not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     summary: Remove um endereço pelo ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica se o endereço foi removido com sucesso
 *                   example: true
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routerAddres.delete("/address/:id", async (req, res) => {
    try {
        const result = await addressController.remover(parseInt(req.params.id));
        if (result) {
            res.status(200).json({ success: result });
        } else {
            res.status(404).json({ message: "Address not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});