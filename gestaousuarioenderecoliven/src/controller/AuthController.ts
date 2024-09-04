import { Repository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt';
import { AppDataSource } from "../data-source";
import { Request, Response, NextFunction } from 'express';
import * as dotenv from "dotenv";
import * as jwt from 'jsonwebtoken';
dotenv.config()

const SECRET = process.env.SECRET;
export class AuthController {
    private _repo: Repository<User>;

    constructor() {
        this._repo = AppDataSource.getRepository(User);
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await this._repo.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "Usuário não encontrado!",
                    data: { email }
                });
            }

            const validacaoPassword = await bcrypt.compare(password, user.password);

            if (!validacaoPassword) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "Não autorizado!",
                });
            }
            const token = jwt.sign({ id: user.id, name: user.name }, SECRET, {
                expiresIn: 60 * 60
            });

            res.status(200).json({
                statusCode: 200,
                message: "Login realizado com sucesso!",
                data: { token }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                statusCode: 500,
                message: error.message
            });
        }
    }

    async verificarToken(req: Request, res: Response, next: NextFunction) {
        const tokenHeader = req.headers["authorization"];
        const token = tokenHeader && tokenHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: "Não autorizado!",
            });
        }

        try {
            jwt.verify(token, process.env.SECRET);
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                statusCode: 500,
                message: "Token não válido."
            });
        }
    }
}
