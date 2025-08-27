type Props = {
  trenutna: number;
  ukupno: number;
  onPromeni: (nova: number) => void;
};

export function Paginacija({ trenutna, ukupno, onPromeni }: Props) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <button disabled={trenutna === 1} onClick={() => onPromeni(trenutna - 1)}>
        Prethodna
      </button>
      <span style={{ margin: "0 10px" }}>
        Stranica {trenutna} od {ukupno}
      </span>
      <button disabled={trenutna === ukupno} onClick={() => onPromeni(trenutna + 1)}>
        Sledeća
      </button>
    </div>
  );
}
