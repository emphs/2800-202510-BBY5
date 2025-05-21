import "./styles/Nav.css";
import { MapPin, CircleUser, ArrowUpWideNarrow, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function Nav() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/auth/authorized", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.authorized))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <nav
      className="position-fixed top-0 start-0 w-100 shadow"
      style={{ zIndex: 1030, backgroundColor: "#D5F5E3" }}>
      <ul
        className="d-flex justify-content-center align-items-center m-0 p-2"
        style={{ listStyle: "none" }}>
        <li className="mx-3">
          <button
            className="btn p-0 border-0 bg-transparent"
            onClick={() => navigate({ to: "/home" })}
            title="Home">
            <Home color="rgb(151, 151, 151)" size={32} />
          </button>
        </li>
        <li className="mx-3">
          <button
            className="btn p-0 border-0 bg-transparent"
            onClick={() => navigate({ to: "/map" })}
            title="Map">
            <MapPin color="rgb(151, 151, 151)" size={32} />
          </button>
        </li>
        <li className="mx-3">
          <button
            className="btn p-0 border-0 bg-transparent"
            onClick={() => navigate({ to: "/reports" })}
            title="Reports">
            <ArrowUpWideNarrow color="rgb(151, 151, 151)" size={32} />
          </button>
        </li>
        <li className="mx-3">
          <button
            className="btn p-0 border-0 bg-transparent"
            onClick={() => navigate({ to: "/profile" })}
            title="Profile">
            <CircleUser color="rgb(151, 151, 151)" size={32} />
          </button>
        </li>
        {isAdmin && (
          <li className="mx-3">
            <button className="btn btn-warning fw-bold" onClick={() => navigate({ to: "/admin" })}>
              Go to Admin
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
