import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export interface IntelligenceResponse {
    risk_score: number;
    security_summary: string;
    actionable_fixes: string[];
}

export const getIntelligence = async (auditData: any): Promise<IntelligenceResponse> => {
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

    const prompt = `You are an expert Security Analyst. Review the following domain audit data and provide a numeric risk score (0-100), a concise security summary, and a list of actionable fixes. Give your output strictly as a valid JSON object without markdown wrapping.
Structure: { "risk_score": number, "security_summary": string, "actionable_fixes": string[] }

Audit Data:
${JSON.stringify(auditData, null, 2)}
`;

    try {
        const response = await axios.post(
            'http://localhost:11434/api/generate',
            {
                model: 'llama3',
                prompt: prompt,
                stream: false,
                format: 'json'
            }
        );

        let generatedText = response.data.response || "";
        
        // Sometimes LLMs wrap JSON in ```json blocks even with format: 'json'
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            generatedText = jsonMatch[0];
        }

        return JSON.parse(generatedText) as IntelligenceResponse;
    } catch (error: any) {
        console.error("Error generating intelligence via Ollama local API:", error.message);
        return {
             risk_score: 0,
             security_summary: "Failed to generate summary.",
             actionable_fixes: []
        };
    }
};
