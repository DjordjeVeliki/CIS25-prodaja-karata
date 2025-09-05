import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// DODAJ .js EKSTENZIJE U RUTE
import dogadjaji from './routes/dogadjaji.js';
import kategorije from './routes/kategorije.js';
import kuponi from './routes/kuponi.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/dogadjaji', dogadjaji);
app.use('/api/kategorije', kategorije);
app.use('/api/kuponi', kuponi);

const PORT = Number(process.env.PORT) || 4000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`[API] http://${HOST}:${PORT}`));
