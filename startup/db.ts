import mongoose from 'mongoose';
import winston from 'winston';
import config from "config";

export function setupDB(){
    const db: string = config.get("db");
    mongoose.connect(db).then(() => winston.info(`connected to ${db}.`));
}