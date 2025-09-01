export const formatCena = (n: number) =>
  new Intl.NumberFormat("sr-RS").format(n) + " RSD";

export const formatDatumVreme = (iso: string | number | Date) => {
  const d = new Date(iso);
  return d.toLocaleDateString("sr-RS") + " " + d.toLocaleTimeString("sr-RS");
};

