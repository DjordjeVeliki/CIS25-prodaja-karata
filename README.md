# 🎟️ Prodaja karata – React aplikacija

Ova aplikacija omogućava korisnicima pregled i kupovinu karata za različite događaje (pozorišne predstave, koncerte, muzejske izložbe...).  
Korisnici mogu da se registruju, prijave, pregledaju listu događaja sa filtrima i paginacijom, vide detalje događaja, dodaju ih u korpu i izvrše narudžbinu.  
Aplikacija je rađena u okviru seminarskog rada i pokriva zadate funkcionalnosti za React deo projekta.

---

## 🚀 Pokretanje projekta

1. Klonirati repozitorijum:
   ```bash
   git clone <repo-url>
   cd prodaja-karata
   ```

2. Instalirati zavisnosti:
   ```bash
   npm install
   ```

3. Pokrenuti aplikaciju u development modu:
   ```bash
   npm run dev
   ```

4. Otvoriti u browseru:
   ```
   http://localhost:5173
   ```

---

## 📂 Struktura projekta

- `src/komponente/` – reusable komponente (Navigacija, DogadjajKartica, StarRating, Komentari, VremenskaPrognoza...)  
- `src/stranice/` – stranice aplikacije (Prijava, Registracija, Pocetna, Dogadjaji, DetaljDogadjaja, Profil, Korpa...)  
- `src/kontekst/` – konteksti za globalno stanje (AuthKontekst, KorpaKontekst, ValutaKontekst)  
- `src/modeli/` – TypeScript interfejsi (Korisnik, Dogadjaj, StavkaKorpe, Narudzbina...)  
- `src/klase/` – klase sa metodama (Korpa, OceneMenadzer, KomentariMenadzer)  
- `src/servisi/` – API servisi (pozivi za vreme i geokoding)  
- `src/kuke/` – custom hooks (`useKursEur` sa keširanjem kursa u localStorage)  

---

## ✨ Implementirane funkcionalnosti

- Registracija i prijava korisnika (mock auth)  
- Zaštita ruta (`PrivatnaRuta`, `GostRuta`)  
- Lista događaja sa **paginacijom** i **filterima** (kategorija, cena)  
- Detalji događaja sa prikazom i dodavanjem u **korpu**  
- Korpa sa mogućnošću menjanja količina i obračunom ukupne cene  
- Kuponi i popusti (primena kodova iz `KUPONI`)  
- Prikaz cene u **RSD ↔ EUR** sa kursom iz API-ja (exchangerate.host)  
- Vremenska prognoza za mesto i datum događaja (Open-Meteo API)  
- Čuvanje podataka u **localStorage** (kurs, sesija)  
- Responsivan dizajn uz Bootstrap grid sistem  

---

## 🔧 Tehnologije

- **React 18** + **TypeScript**  
- **Vite** za bundling  
- **React Router DOM** za rute i navigaciju  
- **Bootstrap 5** za stilizaciju i grid  
- **Open-Meteo API** i **Exchangerate API** za realne podatke  
- **LocalStorage** za trajno čuvanje odabranih podataka  

---

## 📌 Napomena

Ovaj repozitorijum predstavlja **React deo seminarskog rada**.  
Baza podataka i Docker deo projekta biće implementirani u sledećoj fazi.  
