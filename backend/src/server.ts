import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runSecurityAudit } from './controllers/auditController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/security-audit', (req, res) => {
    return res.send('Hello World!');
});

// API Endpoints
app.post('/security-audit', runSecurityAudit);

app.listen(PORT, () => {
    console.log(`Security Audit Engine running on http://localhost:${PORT}`);
});