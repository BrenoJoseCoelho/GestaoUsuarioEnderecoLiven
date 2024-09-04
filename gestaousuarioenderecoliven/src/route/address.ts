import { Router } from 'express';
import { AddressController } from '../controller/AddressController';
import { AuthController } from '../controller/AuthController';

export const routerAddres = Router();
const addressController = new AddressController();
const authController = new AuthController();

routerAddres.post("/user/:userId/address", authController.verificarToken, async (req, res) => {
    try {
        const address = req.body;
        address.user = { id: parseInt(req.params.userId) };
        const savedAddress = await addressController.salvar(address);
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

routerAddres.get("/user/:userId/addresses", authController.verificarToken, async (req, res) => {
    try {
        const addresses = await addressController.recuperarPorUsuario(parseInt(req.params.userId));
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

routerAddres.get("/:id", authController.verificarToken, async (req, res) => {
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

routerAddres.put("/:id", authController.verificarToken, async (req, res) => {
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

routerAddres.delete("/:id", authController.verificarToken, async (req, res) => {
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
routerAddres.get('/user/address', authController.verificarToken, async (req, res) => {
    const { country } = req.query;
    if (typeof country !== 'string' || !country.trim()) {
        return res.status(400).json({ message: 'Valid country query parameter is required' });
    }
    try {
        const addresses = await addressController.recuperarEnderecosPorPais(country);
        res.json(addresses);
    } catch (error) {
        console.error('Error retrieving addresses:', error);
        res.status(500).json({ message: error.message });
    }
});