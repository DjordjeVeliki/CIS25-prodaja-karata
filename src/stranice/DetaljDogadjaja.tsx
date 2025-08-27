import { useParams } from "react-router-dom";
import { dogadjaji } from "../podaci/dogadjaji";
import { useContext } from "react";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";

export default function DetaljDogadjaja() {
  const { id } = useParams();
  const dogadjaj = dogadjaji.find(d => d.id === Number(id));
  const { dodajUKorpu } = useContext(KorpaKontekst);

  if (!dogadjaj) return <h2>Događaj nije pronađen</h2>;

  return (
    <div>
      <h2>{dogadjaj.naziv}</h2>
      <p>{dogadjaj.opis}</p>
      <p><strong>Datum:</strong> {dogadjaj.datum}</p>
      <p><strong>Cena:</strong> {dogadjaj.cena} RSD</p>
      <button onClick={() => dodajUKorpu({ idDogadjaja: dogadjaj.id, naziv: dogadjaj.naziv, cena: dogadjaj.cena })}>
        Dodaj u korpu
      </button>
    </div>
  );
}
