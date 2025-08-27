import { useParams } from "react-router-dom";
import { dogadjaji } from "../podaci/dogadjaji";

export default function DetaljDogadjaja() {
  const { id } = useParams();
  const dogadjaj = dogadjaji.find(d => d.id === Number(id));

  if (!dogadjaj) {
    return <h2>Događaj nije pronađen</h2>;
  }

  return (
    <div>
      <h2>{dogadjaj.naziv}</h2>
      <p>{dogadjaj.opis}</p>
      <p><strong>Datum:</strong> {dogadjaj.datum}</p>
      <p><strong>Cena:</strong> {dogadjaj.cena} RSD</p>
    </div>
  );
}
