"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubdomains = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getSubdomains = async (domain) => {
    const isMock = process.env.MOCK_MODE === 'true';
    if (isMock) {
        return {
            subdomains: ["www", "mail", "dev", "staging"],
            meta: { limit_reached: false }
        };
    }
    try {
        const apiKey = process.env.SECURITY_TRAILS_API_KEY;
        if (!apiKey)
            throw new Error("SecurityTrails API Key is missing");
        const response = await axios_1.default.get(`https://api.securitytrails.com/v1/domain/${domain}/subdomains`, {
            headers: {
                "APIKEY": apiKey,
                "accept": "application/json"
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching subdomains from SecurityTrails:", error);
        throw new Error("Failed to fetch subdomains");
    }
};
exports.getSubdomains = getSubdomains;
