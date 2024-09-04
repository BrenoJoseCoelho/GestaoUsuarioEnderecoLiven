import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as logger from 'morgan';
import * as swaggerUi from 'swagger-ui-express';
import { routerUsuario } from './route/usuario';
import { routerAddres } from './route/address';
import * as swaggerDocument from '../swagger.json';

export const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(logger('dev')); 

app.use('/v3/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/user', routerUsuario);
app.use('/address', routerAddres);

app.get('/', (req, res) => res.send('API Liven'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
