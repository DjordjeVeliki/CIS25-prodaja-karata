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
  const url = `${API}/kuponi/proveri?kod=${encodeURIComponent(kod)}&total=${encodeURIComponent(String(total))}`;

  try {

    const res = await fetch(url);
    const data = (await res.json().catch(() => null)) as any;

    if (res.ok && data && data.ok === true) {
      return data as ProveraKuponaOk;
    }
    const razlog =
      (data && (data.razlog as string)) ||
      (typeof data === "string" ? data : undefined) ||
      "Nepostojeći kod.";
    return { ok: false, razlog };
  } catch {
    return { ok: false, razlog: "Greška pri proveri kupona." };
  }
}