import { useContext, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { dodajNarudzbinu } from "../servisi/narudzbine";
import type { Narudzbina } from "../modeli/Narudzbina";

export default function Korpa() {
  const { stavke, promeniKolicinu, ukloniIzKorpe, ocistiKorpu, korpa } = useContext(KorpaKontekst);
  const { korisnik } = useContext(AuthKontekst);
  const [poruka, setPoruka] = useState<string | null>(null);
  const ukupno = useMemo(() => korpa.ukupno(), [korpa]);

  const onKupi = (e: FormEvent) => {
    e.preventDefault();
    setPoruka(null);

    if (!korisnik) {
      setPoruka("Morate biti prijavljeni da biste završili kupovinu.");
      return;
    }
    if (stavke.length === 0) {
      setPoruka("Korpa je prazna.");
      return;
    }

    const narudzbina: Narudzbina = {
      id: crypto.randomUUID(),
      korisnikId: korisnik.id,
      ukupno,
      datumISO: new Date().toISOString(),
      stavke: stavke.map(s => ({
        idDogadjaja: s.idDogadjaja,
        naziv: s.naziv,
        cena: s.cena,
        kolicina: s.kolicina,
      })),
    };

    dodajNarudzbinu(korisnik.id, narudzbina);
    ocistiKorpu();
    setPoruka("Kupovina uspešna! Račun je sačuvan u vašim narudžbinama.");
  };

  return (
    <div>
      <h2>Korpa</h2>

      {stavke.length === 0 ? (
        <p>Korpa je prazna.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Događaj</th>
              <th>Cena</th>
              <th>Količina</th>
              <th>Ukupno</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stavke.map(s => (
              <tr key={s.idDogadjaja}>
                <td>{s.naziv}</td>
                <td>{s.cena} RSD</td>
                <td>
                  <button onClick={() => promeniKolicinu(s.idDogadjaja, Math.max(1, s.kolicina - 1))}>-</button>
                  <span style={{ padding: "0 8px" }}>{s.kolicina}</span>
                  <button onClick={() => promeniKolicinu(s.idDogadjaja, s.kolicina + 1)}>+</button>
                </td>
                <td>{s.cena * s.kolicina} RSD</td>
                <td>
                  <button onClick={() => ukloniIzKorpe(s.idDogadjaja)}>Ukloni</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 16 }}>
        <strong>Ukupno: {ukupno} RSD</strong>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={ocistiKorpu}>Isprazni korpu</button>{" "}
        <button onClick={onKupi as any}>Završi kupovinu</button>
      </div>

      {poruka && <p style={{ color: "green", marginTop: 12 }}>{poruka}</p>}
    </div>
  );
}
