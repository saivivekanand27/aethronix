import { runSecurityAudit } from './src/controllers/auditController';

const req = { body: { domain: 'example.com' } } as any;
const res = {
    json: (data: any) => {
        console.log("SUCCESS:", JSON.stringify(data, null, 2));
    },
    status: (code: number) => {
        return {
            json: (data: any) => {
                console.log(`ERROR (${code}):`, JSON.stringify(data, null, 2));
            }
        };
    }
} as any;

console.log("Starting local test...");
runSecurityAudit(req, res).then(() => {
    console.log("Test completed.");
}).catch(console.error);
