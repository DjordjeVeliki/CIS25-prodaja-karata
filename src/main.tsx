import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { KorpaKontekstProvajder } from "./kontekst/KorpaKontekst";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KorpaKontekstProvajder>
      <RouterProvider router={router} />
    </KorpaKontekstProvajder>
  </React.StrictMode>
);
