"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSecurityAudit = void 0;
const express_1 = require("express");
const securityTrails_1 = require("../services/securityTrails");
const shodan_1 = require("../services/shodan");
const huggingface_1 = require("../services/huggingface");
const runSecurityAudit = async (req, res) => {
    const { domain } = req.body;
    if (!domain || typeof domain !== 'string') {
        res.status(400).json({ error: "Missing or invalid 'domain' in request body." });
        return;
    }
    try {
        // Step 1: Get subdomains
        const subdomainResult = await (0, securityTrails_1.getSubdomains)(domain);
        // We only process the root and up to 5 subdomains to avoid long mock/live queries
        const targetHostnames = [domain, ...subdomainResult.subdomains.map(sub => `${sub}.${domain}`).slice(0, 5)];
        // Step 2: Get Shodan data for each
        const auditResults = await Promise.all(targetHostnames.map(async (hostname) => {
            const shodanData = await (0, shodan_1.getShodanData)(hostname);
            if (!shodanData)
                return null;
            return {
                subdomain: hostname,
                ip: shodanData.ip_str,
                shodan_data: {
                    ports: shodanData.ports,
                    services: shodanData.data.map(d => `${d.product || 'Unknown'} ${d.version || ''}`.trim())
                }
            };
        }));
        const filteredResults = auditResults.filter(Boolean);
        const dataToAnalyze = {
            domain,
            findings: filteredResults
        };
        // Step 3: Gather intelligence
        const intelligence = await (0, huggingface_1.getIntelligence)(dataToAnalyze);
        // Final payload
        res.json({
            domain,
            audit_results: filteredResults,
            intelligence
        });
    }
    catch (error) {
        console.error("Audit error:", error);
        res.status(500).json({ error: "Internal server error during audit." });
    }
};
exports.runSecurityAudit = runSecurityAudit;
//# sourceMappingURL=auditController.js.map