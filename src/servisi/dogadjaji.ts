
import { getJson } from "./api";

export type Dogadjaj = {
  id: number;
  naziv: string;
  opis?: string | null;
  datum: string;             
  cena: number;              
  kategorija?: string | null;
  mesto: string;
  slika_url?: string | null; 
};

export type ListaDogadjaja = {
  items: Dogadjaj[];
  total: number;
  page: number;
  pageSize: number;
};

export async function ucitajDogadjaje(opts?: {
  search?: string;
  kategorija?: string;
  sort?: "datum" | "cena" | "naziv";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) {
  const q = new URLSearchParams();
  if (opts?.search) q.set("search", opts.search);
  if (opts?.kategorija) q.set("kategorija", opts.kategorija);
  if (opts?.sort) q.set("sort", opts.sort);
  if (opts?.order) q.set("order", opts.order);
  if (opts?.page) q.set("page", String(opts.page));
  if (opts?.pageSize) q.set("pageSize", String(opts.pageSize));
  const qs = q.toString() ? `?${q.toString()}` : "";
  return getJson<ListaDogadjaja>(`/dogadjaji${qs}`);
}

export async function ucitajDogadjaj(id: number) {
  return getJson<Dogadjaj>(`/dogadjaji/${id}`);
}
