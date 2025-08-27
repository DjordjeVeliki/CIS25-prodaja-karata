import { useState } from "react";

type Props = {
  onFilter: (kategorija: string, minCena: number, maxCena: number) => void;
};

export function Filteri({ onFilter }: Props) {
  const [kategorija, setKategorija] = useState("");
  const [minCena, setMinCena] = useState<number | "">("");
  const [maxCena, setMaxCena] = useState<number | "">("");

  return (
    <div style={{ marginBottom: "1rem" }}>
      <select value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
        <option value="">Sve kategorije</option>
        <option value="pozoriste">Pozorište</option>
        <option value="koncert">Koncert</option>
        <option value="izlozba">Izložba</option>
      </select>

      <input
        type="number"
        placeholder="Min cena"
        value={minCena}
        onChange={(e) => setMinCena(Number(e.target.value) || "")}
      />

      <input
        type="number"
        placeholder="Max cena"
        value={maxCena}
        onChange={(e) => setMaxCena(Number(e.target.value) || "")}
      />

      <button onClick={() => onFilter(kategorija, Number(minCena) || 0, Number(maxCena) || Infinity)}>
        Primeni filtere
      </button>
    </div>
  );
}
