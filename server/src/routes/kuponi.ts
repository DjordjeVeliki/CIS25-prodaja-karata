import { Router } from "express";
import { pool } from "../db.js";
import type { RowDataPacket } from "mysql2/promise";

const r = Router();

interface KuponRow extends RowDataPacket {
  code: string;
  type: "percent" | "fixed";
  value: number;
  min: number | null;
  description: string | null;
}


r.get("/proveri", async (req, res) => {
  const { kod = "", total = "0" } = req.query as Record<string, string>;
  const ukupan = Number(total) || 0;

  if (!kod.trim()) {
    return res.status(400).json({ ok: false, razlog: "Nedostaje kupon kod" });
  }


  const code = kod.trim().toUpperCase();

  console.log("[KUPOni] proveri", { code, ukupan });

  const [rows] = await pool.query<KuponRow[]>(
    `SELECT code, type, value, min, description
     FROM kuponi
     WHERE code = :code
     LIMIT 1`,
    { code }
  );

  if (!rows.length) {
    return res.status(404).json({ ok: false, razlog: "Nepostojeći kod" });
  }

  const k = rows[0];

  if (k.min != null && ukupan < Number(k.min)) {
    return res
      .status(400)
      .json({ ok: false, razlog: `Minimalni iznos je ${k.min}` });
  }

  let popust = 0;
  if (k.type === "percent") popust = (ukupan * Number(k.value)) / 100;
  else popust = Number(k.value);

  const novo = Math.max(0, ukupan - popust);

  return res.json({
    ok: true,
    kupon: {
      kod: k.code,                     
      tip: k.type,                     
      vrednost: Number(k.value),
      description: k.description ?? undefined,
    },
    popust,
    total_nakon_popusta: novo,
  });
});

export default r;
