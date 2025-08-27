import { useContext } from "react";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";

export default function Korpa() {
  const { stavke, ukupno, ukupnoKomada, ukloniIzKorpe, promeniKolicinu, ocistiKorpu } = useContext(KorpaKontekst);

  if (stavke.length === 0) return <h2>Korpa je prazna</h2>;

  return (
    <div>
      <h2>Korpa</h2>
      <table cellPadding={8}>
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Cena</th>
            <th>Količina</th>
            <th>Iznos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stavke.map(s => (
            <tr key={s.idDogadjaja}>
              <td>{s.naziv}</td>
              <td>{s.cena} RSD</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={s.kolicina}
                  onChange={e => promeniKolicinu(s.idDogadjaja, Number(e.target.value))}
                  style={{ width: 60 }}
                />
              </td>
              <td>{s.cena * s.kolicina} RSD</td>
              <td>
                <button onClick={() => ukloniIzKorpe(s.idDogadjaja)}>Ukloni</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p><strong>Ukupno komada:</strong> {ukupnoKomada}</p>
      <p><strong>Ukupno za plaćanje:</strong> {ukupno} RSD</p>

      <button onClick={ocistiKorpu}>Isprazni korpu</button>
    </div>
  );
}
