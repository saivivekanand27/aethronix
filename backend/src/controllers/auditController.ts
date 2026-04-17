import { Request, Response, RequestHandler } from 'express';
import { getShodanData } from '../services/shodan';
import { getIntelligence } from '../services/ollama';

export const runSecurityAudit: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { domain } = req.body;

    if (!domain || typeof domain !== 'string') {
        res.status(400).json({ error: "Missing or invalid 'domain' in request body." });
        return;
    }

    try {
        // Step 1: Get Shodan data for the domain
        const shodanData = await getShodanData(domain);
        
        let filteredResults = [];
        if (shodanData) {
            filteredResults.push({
                subdomain: domain,
                ip: shodanData.ip_str,
                shodan_data: {
                    ports: shodanData.ports,
                    services: shodanData.data.map(d => `${d.product || 'Unknown'} ${d.version || ''}`.trim())
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
