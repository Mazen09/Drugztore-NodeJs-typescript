const Joi = require("joi");

export function setupValidations(){
    Joi.ObjectId = require("joi-objectid")(Joi);
}