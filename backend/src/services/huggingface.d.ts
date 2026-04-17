export interface IntelligenceResponse {
    risk_score: number;
    security_summary: string;
    actionable_fixes: string[];
}
export declare const getIntelligence: (auditData: any) => Promise<IntelligenceResponse>;
//# sourceMappingURL=huggingface.d.ts.map