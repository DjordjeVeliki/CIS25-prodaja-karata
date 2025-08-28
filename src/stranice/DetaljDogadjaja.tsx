import { useParams } from "react-router-dom";
import { dogadjaji } from "../podaci/dogadjaji";
import { useContext } from "react";
import { KorpaKontekst } from "../kontekst/KorpaKontekst";
import { formatCena, formatDatumVreme } from "../utils/format";
import StarRating from "../komponente/StarRating";
import Komentari from "../komponente/Komentari";



export default function DetaljDogadjaja() {
  const { id } = useParams();
  const dogadjaj = dogadjaji.find(d => d.id === Number(id));
  const { dodajUKorpu } = useContext(KorpaKontekst);

  if (!dogadjaj) return <h2>Događaj nije pronađen</h2>;

  return (
    <div>
      <h2>{dogadjaj.naziv}</h2>
      <p>{dogadjaj.opis}</p>
      <p><strong>Datum:</strong> {formatDatumVreme(dogadjaj.datum)}</p>
      <p><strong>Cena:</strong> {formatCena(dogadjaj.cena)} RSD</p>
      <button onClick={() => dodajUKorpu({ idDogadjaja: dogadjaj.id, naziv: dogadjaj.naziv, cena: dogadjaj.cena })}>
        Dodaj u korpu
      </button>
      <StarRating dogadjajId={dogadjaj.id} />
      <Komentari dogadjajId={dogadjaj.id} />
    </div>
  );
}
