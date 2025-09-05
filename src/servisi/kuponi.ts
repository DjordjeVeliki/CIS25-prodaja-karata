
import { API } from "./api";

export type KuponTip = "percent" | "fixed";

export type ProveraKuponaOk = {
  ok: true;
  kupon: {
    kod: string;
    tip: KuponTip;
    vrednost: number;
    description?: string | null;
  };
  popust: number;
  total_nakon_popusta: number;
};

export type ProveraKuponaFail = {
  ok: false;
  razlog?: string;
};

export type ProveraKuponaResp = ProveraKuponaOk | ProveraKuponaFail;


export async function proveriKuponKod(
  kod: string,
  total: number
): Promise<ProveraKuponaResp> {
  const url = `${API}/kuponi/proveri?kod=${encodeURIComponent(
    kod
  )}&total=${encodeURIComponent(String(total))}`;

  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    const txt = await res.text().catch(() => "");
    const data = txt ? (() => { try { return JSON.parse(txt); } catch { return txt; } })() : null;

    if (res.ok && data && typeof data === "object" && (data as any).ok === true) {
      return data as ProveraKuponaOk;
    }

    const razlog =
      (data && typeof data === "object" && (data as any).razlog) ||
      (typeof data === "string" ? data : undefined) ||
      "Nepostojeći kod.";
    return { ok: false, razlog: String(razlog) };
  } catch {
    return { ok: false, razlog: "Greška pri proveri kupona." };
  }
}
