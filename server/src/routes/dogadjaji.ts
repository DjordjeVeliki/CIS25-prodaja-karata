import { Router } from 'express';
import { pool } from '../db.js';
import type { RowDataPacket } from 'mysql2/promise';

const r = Router();

interface DogadjajRow extends RowDataPacket {
  id: number;
  naziv: string;
  opis: string | null;
  datum: string | Date;
  cena: number;
  kategorija: string | null;
  mesto: string;
}

r.get('/', async (req, res) => {
  const {
    search = '',
    kategorija = '',
    sort = 'datum',
    order = 'asc',
    page = '1',
    pageSize = '12',
  } = req.query as Record<string, string>;

  const allowedSort = new Set(['datum', 'cena', 'naziv']);
  const sortCol = allowedSort.has(sort) ? sort : 'datum';
  const sortDir = order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const p = Number(page) || 1;
  const ps = Math.min(1000, Number(pageSize) || 12);
  const off = (p - 1) * ps;

  const where: string[] = [];
  const params: any = {};

  if (search) {
    where.push('(naziv LIKE :q OR opis LIKE :q OR mesto LIKE :q)');
    params.q = `%${search}%`;
  }
  if (kategorija) {
    where.push('kategorija = :kategorija');
    params.kategorija = kategorija;
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  
  const [rows] = await pool.query<DogadjajRow[]>(
    `SELECT SQL_CALC_FOUND_ROWS id, naziv, opis, datum, cena, kategorija, mesto
     FROM dogadjaji
     ${whereSql}
     ORDER BY ${sortCol} ${sortDir}
     LIMIT :lim OFFSET :off`,
    { ...params, lim: ps, off }
  );

  const [totals] = await pool.query<RowDataPacket[]>(
    'SELECT FOUND_ROWS() AS total'
  );
  const total = Number((totals[0] as any)?.total ?? 0);

  res.json({ items: rows, total, page: p, pageSize: ps });
});

r.get('/:id', async (req, res) => {
  const id = Number(req.params.id) || 0;
  if (!id) return res.status(400).json({ error: 'Neispravan ID' });

  const [rows] = await pool.query<DogadjajRow[]>(
    `SELECT id, naziv, opis, datum, cena, kategorija, mesto
     FROM dogadjaji
     WHERE id = :id
     LIMIT 1`,
    { id }
  );

  if (!rows.length) return res.status(404).json({ error: 'Događaj nije pronađen' });
  res.json(rows[0]);
});

export default r;
