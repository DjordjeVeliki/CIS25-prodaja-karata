import { useContext, useMemo, useState } from "react";
import { AuthKontekst } from "../kontekst/AuthKontekst";
import { KomentariMenadzer } from "../klase/KomentariMenadzer";
import type { TipKomentara } from "../klase/KomentariMenadzer";


type Props = { dogadjajId: number };

export default function Komentari({ dogadjajId }: Props) {
  const { korisnik } = useContext(AuthKontekst);
  const km = new KomentariMenadzer();

  const korisnikKljuc = useMemo(() => {
    if (!korisnik) return null;
    const k: any = korisnik;
    if (k.id !== undefined) return `id:${k.id}`;
    if (k.email) return `email:${k.email}`;
    if (k.ime) return `ime:${k.ime}`;
    return "ulogovan";
  }, [korisnik]);

  const autorPrikaz = useMemo(() => {
    if (!korisnik) return "";
    const k: any = korisnik;
    return k.ime || k.email || "Korisnik";
  }, [korisnik]);

  const [lista, setLista] = useState<TipKomentara[]>(km.svi(dogadjajId));
  const [tekst, setTekst] = useState("");

  const formatVreme = (ms: number) =>
    new Date(ms).toLocaleString();

  const dodaj = () => {
    if (!korisnikKljuc) return;
    const cist = tekst.trim();
    if (cist.length < 3) return;
    if (cist.length > 500) return;
    const nov = km.dodaj(dogadjajId, korisnikKljuc, autorPrikaz, cist);
    setLista([nov, ...lista]);
    setTekst("");
  };

  const obrisi = (id: string) => {
    if (!korisnikKljuc) return;
    const ok = km.obrisi(dogadjajId, id, korisnikKljuc);
    if (ok) setLista(lista.filter(k => k.id !== id));
  };

  return (
    <div className="mt-4">
      <h5 className="mb-3">Komentari ({lista.length})</h5>

      {/* Forma za unos */}
      {korisnikKljuc ? (
        <div className="mb-3">
          <label className="form-label">Dodaj komentar</label>
          <textarea
            className="form-control"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            rows={3}
            placeholder="Napišite svoj utisak o događaju..."
            maxLength={500}
          />
          <div className="d-flex justify-content-between mt-2">
            <small className="text-muted">{tekst.length}/500</small>
            <button className="btn btn-primary btn-sm" onClick={dodaj} disabled={tekst.trim().length < 3}>
              Objavi
            </button>
          </div>
        </div>
      ) : (
        <p className="text-muted">Prijavite se da biste ostavili komentar.</p>
      )}

      {/* Lista komentara */}
      <div className="vstack gap-3">
        {lista.map((k) => (
          <div key={k.id} className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <strong>{k.autorPrikaz}</strong>
                <small className="text-muted">{formatVreme(k.vreme)}</small>
              </div>
              <p className="mb-2 mt-2">{k.tekst}</p>
              {korisnikKljuc === k.autorKljuc && (
                <button className="btn btn-link btn-sm text-danger p-0" onClick={() => obrisi(k.id)}>
                  Obriši
                </button>
              )}
            </div>
          </div>
        ))}
        {lista.length === 0 && <p className="text-muted">Još nema komentara.</p>}
      </div>
    </div>
  );
}
