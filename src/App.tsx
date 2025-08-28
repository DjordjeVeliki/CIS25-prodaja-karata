import "./App.css";
import Navigacija from "./komponente/Navigacija";

function App() {
  return (
    <>
      <Navigacija />
      <div className="container my-4">
        <h1 className="mb-3">Prodaja karata</h1>
        <p className="text-muted">
          Početni skelet — navigacija je gore, slede stranice i funkcionalnosti.
        </p>
      </div>
    </>
  );
}

export default App;
