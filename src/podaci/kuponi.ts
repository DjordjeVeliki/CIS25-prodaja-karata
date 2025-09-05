export type Kupon = {
  type: "percent" | "fixed";
  value: number;
  min?: number;
  description?: string;
};


