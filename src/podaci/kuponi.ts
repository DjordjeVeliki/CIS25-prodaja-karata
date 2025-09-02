export type Kupon = {
  type: "percent" | "fixed";
  value: number;
  min?: number;
  description?: string;
};

export const KUPONI: Record<string, Kupon> = {
  STUDENT10: { type: "percent", value: 10, description: "Studentski popust 10%" },
  WELCOME300: { type: "fixed", value: 300, description: "Dobrodošlica -300 RSD" },
  VIP15: { type: "percent", value: 15, min: 3000, description: "15% za porudžbine ≥ 3000 RSD" },
};
