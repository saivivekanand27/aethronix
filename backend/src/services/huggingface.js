"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntelligence = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getIntelligence = async (auditData) => {
    const isMock = process.env.MOCK_MODE === 'true';
    if (isMock) {
        return {
            risk_score: 65,
            security_summary: "The domain exposes internal dev endpoints and runs outdated Tomcat versions.",
            actionable_fixes: [
                "Restrict access to port 8080 or place it behind a WAF.",
                "Update Tomcat to the latest stable release."
            ]
        };
    }
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey)
        throw new Error("Hugging Face API Key is missing");
    const prompt = `You are an expert Security Analyst. Review the following domain audit data and provide a numeric risk score (0-100), a concise security summary, and a list of actionable fixes. Give your output strictly as valid JSON without markdown wrapping. 
Structure: { "risk_score": number, "security_summary": string, "actionable_fixes": string[] }

Audit Data:
${JSON.stringify(auditData, null, 2)}
`;
    try {
        const response = await axios_1.default.post('https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct', {
            inputs: prompt,
            parameters: {
                max_new_tokens: 500,
                return_full_text: false
            }
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        let generatedText = response.data[0]?.generated_text || "";
        // Try to clean up the response to extract just the JSON
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            generatedText = jsonMatch[0];
        }
        return JSON.parse(generatedText);
    }
    catch (error) {
        console.error("Error generating intelligence via Hugging Face:", error.message);
        return {
            risk_score: 0,
            security_summary: "Failed to generate summary.",
            actionable_fixes: []
        };
    }
};
exports.getIntelligence = getIntelligence;
//# sourceMappingURL=huggingface.js.map