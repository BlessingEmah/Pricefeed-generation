import dotenv from 'dotenv';
dotenv.config();

export const POLYGON_MAINNET_URL = process.env.POLYGON_MAINNET_URL || "";
export const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
export const INCH_CONTRACT_ADDRESS = process.env.INCH_CONTRACT_ADDRESS || "";
export const INCH_OWNER_ADDRESS = process.env.INCH_OWNER_ADDRESS || "";
export const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS || "";
export const USDT_OWNER_ADDRESS = process.env.USDT_OWNER_ADDRESS || "";
export const USDT_LIQUIDTY_ADDRESS = process.env.USDT_LIQUIDTY_ADDRESS || "";
export const INCHUSDT_PRICE_ADDRESS = process.env.INCHUSDT_PRICE_ADDRESS || "";