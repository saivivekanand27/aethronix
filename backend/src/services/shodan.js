"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShodanData = void 0;
const axios_1 = __importDefault(require("axios"));
const dns = __importStar(require("dns"));
const util_1 = require("util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resolve4 = (0, util_1.promisify)(dns.resolve4);
const getShodanData = async (hostname) => {
    const isMock = process.env.MOCK_MODE === 'true';
    if (isMock) {
        return {
            ip_str: "192.168.1.5",
            org: "Mock Organization",
            ports: [80, 443, 8080],
            data: [
                { port: 80, product: "nginx", version: "1.18.0" },
                { port: 443, product: "nginx", version: "1.18.0" },
                { port: 8080, product: "Apache Tomcat", version: "9.0.41" }
            ]
        };
    }
    try {
        const apiKey = process.env.SHODAN_API_KEY;
        if (!apiKey)
            throw new Error("Shodan API Key is missing");
        // Resolve hostname to IP first
        let ips;
        try {
            ips = await resolve4(hostname);
        }
        catch (e) {
            console.log(`Could not resolve IP for ${hostname}`);
            return null; // Domain might not have an A record
        }
        if (ips.length === 0)
            return null;
        const ip = ips[0];
        const response = await axios_1.default.get(`https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`);
        return {
            ip_str: response.data.ip_str,
            org: response.data.org,
            ports: response.data.ports || [],
            data: response.data.data.map((item) => ({
                port: item.port,
                product: item.product,
                version: item.version
            }))
        };
    }
    catch (error) {
        // Shodan returns 404 if no information is available for the IP
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error(`Error fetching Shodan data for ${hostname}:`, error.message);
        return null;
    }
};
exports.getShodanData = getShodanData;
//# sourceMappingURL=shodan.js.map