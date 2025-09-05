// src/servisi/kategorije.ts
import { getJson } from "./api";

export async function ucitajKategorije(): Promise<string[]> {
  return getJson<string[]>("/kategorije");
}
