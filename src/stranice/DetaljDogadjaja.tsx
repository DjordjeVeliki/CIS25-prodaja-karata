import { useParams } from "react-router-dom";

export default function DetaljDogadjaja() {
  const { id } = useParams();
  return <h2>Detalji događaja (ID: {id})</h2>;
}
