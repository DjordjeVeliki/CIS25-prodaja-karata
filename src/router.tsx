import { createBrowserRouter } from "react-router-dom";

import Okvir from "./Okvir";


import Pocetna from "./stranice/Pocetna";
import Prijava from "./stranice/Prijava";
import Registracija from "./stranice/Registracija";
import Dogadjaji from "./stranice/Dogadjaji";
import DetaljDogadjaja from "./stranice/DetaljDogadjaja";
import Korpa from "./stranice/Korpa";
import Profil from "./stranice/Profil";
import NotFound from "./stranice/NotFound";


import GostRuta from "./komponente/GostRuta";
import PrivatnaRuta from "./zastita/PrivatnaRuta"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Okvir />,
    children: [
      
      { index: true, element: <Pocetna /> },
      { path: "dogadjaji", element: <Dogadjaji /> },
      { path: "dogadjaji/:id", element: <DetaljDogadjaja /> },

      
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

      
      {
        element: <PrivatnaRuta />,
        children: [
          { path: "korpa", element: <Korpa /> },
          { path: "profil", element: <Profil /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
