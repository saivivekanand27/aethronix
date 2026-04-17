import axios from 'axios';
import * as dns from 'dns';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

const resolve4 = promisify(dns.resolve4);

export interface ShodanData {
    port: number;
    product?: string;
    version?: string;
}

export interface ShodanResponse {
    ip_str: string;
    org?: string;
    ports: number[];
    data: ShodanData[];
}

export const getShodanData = async (hostname: string): Promise<ShodanResponse | null> => {
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
        if (!apiKey) throw new Error("Shodan API Key is missing");

        // Resolve hostname to IP first
        let ips: string[];
        try {
            ips = await resolve4(hostname);
        } catch (e) {
            // Suppress verbose IP resolution failures
            return null; // Domain might not have an A record
        }

        if (ips.length === 0) return null;
        
        const ip = ips[0];
        
        const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`);
        
        return {
            ip_str: response.data.ip_str,
            org: response.data.org,
            ports: response.data.ports || [],
            data: response.data.data.map((item: any) => ({
                port: item.port,
                product: item.product,
                version: item.version
            }))
        };
    } catch (error: any) {
        // Shodan returns 404 if no information is available
        // Shodan returns 403 if the endpoint requires an upgraded plan or lack of credits
        if (error.response && (error.response.status === 404 || error.response.status === 403)) {
            return null;
        }
        console.error(`Error fetching Shodan data for ${hostname}:`, error.message);
        return null;
    }
};
