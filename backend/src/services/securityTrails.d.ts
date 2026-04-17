export interface SubdomainResult {
    subdomains: string[];
    meta: {
        limit_reached: boolean;
    };
}
export declare const getSubdomains: (domain: string) => Promise<SubdomainResult>;
//# sourceMappingURL=securityTrails.d.ts.map