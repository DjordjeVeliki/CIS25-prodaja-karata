import { createBrowserRouter } from "react-router-dom";

import Okvir from "./Okvir";

// stranice
import Pocetna from "./stranice/Pocetna";
import Prijava from "./stranice/Prijava";
import Registracija from "./stranice/Registracija";
import Dogadjaji from "./stranice/Dogadjaji";
import DetaljDogadjaja from "./stranice/DetaljDogadjaja";
import Korpa from "./stranice/Korpa";
import Profil from "./stranice/Profil";
import NotFound from "./stranice/NotFound";

// zaštite
import GostRuta from "./komponente/GostRuta";
import PrivatnaRuta from "./zastita/PrivatnaRuta"; // ako se kod tebe zove ZasticenaRuta, izmeni ovaj import

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Okvir />,
    children: [
      // javne rute
      { index: true, element: <Pocetna /> },
      { path: "dogadjaji", element: <Dogadjaji /> },
      { path: "dogadjaji/:id", element: <DetaljDogadjaja /> },

      // samo za goste (ulogovani se preusmeravaju na /profil)
      { path: "prijava", element: (
          <GostRuta>
            <Prijava />
          </GostRuta>
        )
      },
      { path: "registracija", element: (
          <GostRuta>
            <Registracija />
          </GostRuta>
        )
      },

      // samo za ulogovane (PrivatnaRuta štiti sve child rute)
      {
        element: <PrivatnaRuta />,
        children: [
          { path: "korpa", element: <Korpa /> },
          { path: "profil", element: <Profil /> },
        ],
      },

      // 404 mora biti poslednja
      { path: "*", element: <NotFound /> },
    ],
  },
]);
