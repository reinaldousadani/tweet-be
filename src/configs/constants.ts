import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";

dotenv.config();

const configService = new ConfigService();

export const dataPerPage = 10;

export const jwtSecret = configService.get("JWT_SECRET_KEY") || "supersecret";
