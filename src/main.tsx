import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { KorpaKontekstProvajder } from "./kontekst/KorpaKontekst";
import { AuthProvajder } from "./kontekst/AuthKontekst";
import { ValutaKontekstProvajder } from "./kontekst/ValutaKontekst";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvajder>
      <KorpaKontekstProvajder>
        <ValutaKontekstProvajder>
          <RouterProvider router={router} />
        </ValutaKontekstProvajder>
      </KorpaKontekstProvajder>
    </AuthProvajder>
  </React.StrictMode>
);
