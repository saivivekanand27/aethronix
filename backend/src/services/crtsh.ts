import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export interface SubdomainResult {
    subdomains: string[];
}

interface CrtShEntry {
    name_value: string;
}

export const getSubdomains = async (domain: string): Promise<SubdomainResult> => {
    const isMock = process.env.MOCK_MODE === 'true';

    if (isMock) {
        return {
            subdomains: ["www", "mail", "dev", "staging"]
        };
    }

    try {
        // Find certificates matching the domain wildcard
        const response = await axios.get<CrtShEntry[]>(`https://crt.sh/?q=%.${domain}&output=json`);
        
        const subs = new Set<string>();
        
        if (Array.isArray(response.data)) {
            for (const entry of response.data) {
                // name_value can contain multiple domains separated by newlines
                const parts = entry.name_value.split('\n');
                
                for (const part of parts) {
                    let clean = part.toLowerCase().trim();
                    
                    // remove wildcard characters
                    if (clean.startsWith('*.')) {
                        clean = clean.substring(2);
                    }
                    
                    if (clean.endsWith(`.${domain}`)) {
                        const prefix = clean.substring(0, clean.length - domain.length - 1);
                        if (prefix && !prefix.includes('*')) {
                            subs.add(prefix);
                        }
                    }
                }
            }
        }

        return { subdomains: Array.from(subs) };
    } catch (error) {
        console.error("Error fetching subdomains from CRT.sh:", error);
        throw new Error("Failed to fetch subdomains");
    }
};
