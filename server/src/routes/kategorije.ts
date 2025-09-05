import { Router } from 'express';
import { pool } from '../db.js';
import type { RowDataPacket } from 'mysql2/promise';

const r = Router();

interface KategorijaRow extends RowDataPacket {
  naziv: string;
}


r.get('/', async (_req, res) => {
  const [rows] = await pool.query<KategorijaRow[]>(
    'SELECT naziv FROM kategorije ORDER BY naziv ASC'
  );
  res.json(rows.map(r => r.naziv));
});

export default r;
