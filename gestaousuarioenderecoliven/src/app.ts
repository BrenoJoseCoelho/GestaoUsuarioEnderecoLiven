import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as logger from 'morgan';
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { authenticateJWT } from './middleware/authenticateJWT';
import { routerUsuario } from './route/usuario';
import { routerAddres } from './route/address';
import { UserController } from "./controller/UserController";

const userController = new UserController();
// Cria a aplicação
export const app = express();

// Configurações de middleware
app.use(cors()); // Libera o acesso aos serviços
app.use(bodyParser.json()); // Permite receber e enviar JSON
app.use(logger('dev')); // Configura os logs

// Configuração do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Liven',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./route/**/*.ts'], // Caminho para os arquivos de rota
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas públicas (sem autenticação)
app.post('/login', async (req, res) => {
    try {
        // Lógica para autenticação e geração de token JWT
        const token = await userController.login(req.body, res); // Ajuste conforme necessário
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/register', async (req, res) => {
    try {
        const user = await userController.register(req.body); // Ajuste conforme necessário
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Configuração de rotas protegidas com autenticação
app.use('/usuario', authenticateJWT, routerUsuario);
app.use('/address', authenticateJWT, routerAddres);

// Rota padrão
app.get('/', (req, res) => res.send('API Liven'));

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
