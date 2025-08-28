import { useContext, useEffect, useMemo, useState } from "react";
import { OceneMenadzer } from "../klase/OceneMenadzer";
import { AuthKontekst } from "../kontekst/AuthKontekst";

type Props = { dogadjajId: number };

export default function StarRating({ dogadjajId }: Props) {
  const { korisnik } = useContext(AuthKontekst);
  const om = new OceneMenadzer();

 
  const korisnikKljuc = useMemo(() => {
    if (!korisnik) return null;
    const anyK = korisnik as any;
    if (anyK.id !== undefined) return `id:${anyK.id}`;
    if (anyK.email) return `email:${anyK.email}`;
    if (anyK.ime) return `ime:${anyK.ime}`;
    return "ulogovan";
  }, [korisnik]);

  const [prosek, setProsek] = useState(om.prosek(dogadjajId));
  const [broj, setBroj] = useState(om.brojOcena(dogadjajId));
  const [moja, setMoja] = useState<number | null>(
    korisnikKljuc ? om.mojaOcena(dogadjajId, korisnikKljuc) : null
  );


  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    setProsek(om.prosek(dogadjajId));
    setBroj(om.brojOcena(dogadjajId));
    if (korisnikKljuc) setMoja(om.mojaOcena(dogadjajId, korisnikKljuc));
    else setMoja(null);
  
  }, [dogadjajId, korisnikKljuc]);

  const postavi = (o: number) => {
    if (!korisnikKljuc) return; 
    om.oceni(dogadjajId, korisnikKljuc, o);
    setMoja(o);
    setProsek(om.prosek(dogadjajId));
    setBroj(om.brojOcena(dogadjajId));
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const aktivna = (hover ?? moja ?? 0) >= n;
          const boja = aktivna ? "text-warning" : "text-secondary";
          const mozeKlik = Boolean(korisnikKljuc);

          return (
            <span
              key={n}
              className={`fs-4 ${boja}`}
              role="button"
              style={{ cursor: mozeKlik ? "pointer" : "default", userSelect: "none" }}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => mozeKlik && postavi(n)}
              title={mozeKlik ? `Postavi ocenu ${n}` : "Prijavite se da biste ocenili"}
              aria-label={mozeKlik ? `Postavi ocenu ${n}` : "Samo prijavljeni mogu da ocenjuju"}
            >
              ★
            </span>
          );
        })}
      </div>

      <small className="text-muted d-block">
        Prosek: {prosek} ({broj} ocena)
        {moja ? ` — Vaša ocena: ${moja} (klikom na zvezdicu menjate)` : !korisnikKljuc ? " — Prijavite se da biste ocenili." : ""}
      </small>
    </div>
  );
}
