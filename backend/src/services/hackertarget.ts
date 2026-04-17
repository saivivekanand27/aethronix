import axios from 'axios';

export const getSubdomains = async (domain: string): Promise<{ subdomains: string[] }> => {
    try {
        const response = await axios.get(`https://api.hackertarget.com/hostsearch/?q=${domain}`);
        const data = response.data as string;
        
        // HackerTarget returns CSV: hostname,ip
        const lines = data.split('\n');
        const subdomains = lines
            .map(line => line.split(',')[0].trim())
            .filter(sub => sub && sub !== domain && sub.endsWith(domain));
            
        return { subdomains: Array.from(new Set(subdomains)) };
    } catch (error: any) {
        console.error("HackerTarget API Error:", error.message);
        return { subdomains: [] };
    }
};
