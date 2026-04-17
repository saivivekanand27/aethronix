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
export declare const getShodanData: (hostname: string) => Promise<ShodanResponse | null>;
//# sourceMappingURL=shodan.d.ts.map