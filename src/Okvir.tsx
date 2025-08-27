import { Outlet } from "react-router-dom";
import Navigacija from "./komponente/Navigacija";

export default function Okvir() {
  return (
    <div>
      <Navigacija />
      <main style={{padding:"20px"}}>
        <Outlet />
      </main>
    </div>
  );
}
