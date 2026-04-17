import { Request, Response, RequestHandler } from 'express';
import { getSubdomains } from '../services/crtsh';
import { getShodanData } from '../services/shodan';
import { getIntelligence } from '../services/ollama';

export const runSecurityAudit: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { domain } = req.body;

    if (!domain || typeof domain !== 'string') {
        res.status(400).json({ error: "Missing or invalid 'domain' in request body." });
        return;
    }

    try {
        // Step 1: Get subdomains
        const subdomainResult = await getSubdomains(domain);
        
        // We only process the root and up to 5 subdomains to avoid long mock/live queries
        const targetHostnames = [domain, ...subdomainResult.subdomains.map(sub => `${sub}.${domain}`).slice(0, 5)];

        // Step 2: Get Shodan data for each
        const auditResults = await Promise.all(targetHostnames.map(async (hostname) => {
            const shodanData = await getShodanData(hostname);
            if (!shodanData) return null;

            return {
                subdomain: hostname,
                ip: shodanData.ip_str,
                shodan_data: {
                    ports: nmapData.ports,
                    services: nmapData.services
                }
            });
        }

        const dataToAnalyze = {
            domain,
            findings: filteredResults
        };

        // Step 2: Gather intelligence via Ollama
        const intelligence = await getIntelligence(dataToAnalyze);

        // Final payload
        res.json({
            domain,
            audit_results: filteredResults,
            intelligence
        });

    } catch (error: any) {
        console.error("Audit error:", error);
        res.status(500).json({ error: "Internal server error during audit." });
    }
};
