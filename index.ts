import express, {Application, Request, Response} from 'express';
import winston from 'winston';
import { applyCofigurations } from './startup/config';
import { setupDB } from './startup/db';
import { startLogger } from './startup/logging';
import { setupValidations } from './startup/validations';


const app: Application = express();

startLogger();
applyCofigurations();
setupDB();
setupValidations();



var port = process.env.PORT || 3000;

export const server = app.listen(port, () => winston.info(`Listening on port ${port}`));
