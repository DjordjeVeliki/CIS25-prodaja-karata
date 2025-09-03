export type PrognozaDan = {
  datum: string;
  tMin: number;
  tMax: number;
  wcode: number;
  padavineProcenat: number;
};

function opisWeatherCode(code: number): string {
  const m: Record<number, string> = {
    0: "Vedro",
    1: "Uglavnom vedro",
    2: "Promenljivo",
    3: "Oblačno",
    45: "Magla",
    48: "Položena magla",
    51: "Slaba rosulja",
    53: "Umerena rosulja",
    55: "Jaka rosulja",
    61: "Slaba kiša",
    63: "Kiša",
    65: "Jaka kiša",
    71: "Slab sneg",
    73: "Sneg",
    75: "Jak sneg",
    80: "Pljuskovi",
    81: "Umereni pljuskovi",
    82: "Jaki pljuskovi",
    95: "Grmljavina",
    96: "Grmljavina s gradom",
    99: "Jaka grmljavina s gradom",
  };
  return m[code] ?? `Kod ${code}`;
}

export function opisPrognoze(code: number) {
  return opisWeatherCode(code);
}

export async function geokodiraj(
  mesto: string
): Promise<{ lat: number; lon: number } | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    mesto
  )}&count=1&language=sr&format=json`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const data = await r.json();
  const item = data?.results?.[0];
  if (!item) return null;
  return { lat: item.latitude, lon: item.longitude };
}

export async function prognozaZaLokaciju(
  lat: number,
  lon: number
): Promise<PrognozaDan[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_mean&timezone=auto`;
  const r = await fetch(url);
  if (!r.ok) return [];
  const d = await r.json();

  const res: PrognozaDan[] = (d.daily?.time ?? []).map((_: string, i: number) => ({
    datum: d.daily.time[i],
    tMin: d.daily.temperature_2m_min[i],
    tMax: d.daily.temperature_2m_max[i],
    wcode: d.daily.weathercode[i],
    padavineProcenat: d.daily.precipitation_probability_mean[i],
  }));
  return res;
}
