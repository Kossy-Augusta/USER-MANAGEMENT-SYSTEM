import dotenv from "dotenv";
dotenv.config();
import Joi from "joi";

const envSchema: Joi.ObjectSchema = Joi.object({
    APP_PORT: Joi.number().required(),
    DATABASE_URI: Joi.string().required(),
    ACCESS_TOKEN_SECRET: Joi.string().required(),
    REFRESH_TOKEN_SECRET: Joi.string().required()
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env, {abortEarly: true});

if (error){
    throw new Error(`Environment variable validation error: ${error.details[0].message}`)
}
export default envVars

