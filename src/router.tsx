import { createBrowserRouter } from "react-router-dom";
import Okvir from "./Okvir";
import Pocetna from "./stranice/Pocetna";
import Prijava from "./stranice/Prijava";
import Registracija from "./stranice/Registracija";
import Dogadjaji from "./stranice/Dogadjaji";
import DetaljDogadjaja from "./stranice/DetaljDogadjaja";
import Korpa from "./stranice/Korpa";
import Profil from "./stranice/Profil";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Okvir />,
    children: [
      { index: true, element: <Pocetna /> },
      { path: "prijava", element: <Prijava /> },
      { path: "registracija", element: <Registracija /> },
      { path: "dogadjaji", element: <Dogadjaji /> },
      { path: "dogadjaji/:id", element: <DetaljDogadjaja /> },
      { path: "korpa", element: <Korpa /> },
      { path: "profil", element: <Profil /> },
    ],
  },
]);
