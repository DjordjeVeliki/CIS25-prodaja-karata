import { Link } from "react-router-dom";
import { dogadjaji } from "../podaci/dogadjaji";

export default function Dogadjaji() {
  return (
    <div>
      <h2>Spisak događaja</h2>
      <ul>
        {dogadjaji.map(d => (
          <li key={d.id} style={{marginBottom:"12px"}}>
            <strong>{d.naziv}</strong> - {d.datum} - {d.cena} RSD
            <br />
            <Link to={`/dogadjaji/${d.id}`}>Detalji</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
