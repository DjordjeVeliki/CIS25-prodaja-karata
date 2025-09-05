import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import dogadjaji from './routes/dogadjaji';
import kategorije from './routes/kategorije';
import kuponi from './routes/kuponi';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/dogadjaji', dogadjaji);
app.use('/api/kategorije', kategorije);
app.use('/api/kuponi', kuponi);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API sluša na http://localhost:${port}`);
});
