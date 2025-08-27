import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { KorpaKontekstProvajder } from "./kontekst/KorpaKontekst";
import { AuthProvajder } from "./kontekst/AuthKontekst";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvajder>
      <KorpaKontekstProvajder>
        <RouterProvider router={router} />
      </KorpaKontekstProvajder>
    </AuthProvajder>
  </React.StrictMode>
);
