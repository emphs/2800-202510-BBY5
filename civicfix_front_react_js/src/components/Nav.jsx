import "./styles/Nav.css";
import { MapPin, CircleUser, ArrowUpWideNarrow } from "lucide-react";

export default function Nav() {
  return (
    <div id="container">
      <ul>
        <li>
          <MapPin color="rgb(151, 151, 151)" size={48}></MapPin>
        </li>
        <li>
          <ArrowUpWideNarrow color="rgb(151, 151, 151)" size={48}></ArrowUpWideNarrow>
        </li>
        <li>
          <CircleUser color="rgb(151, 151, 151)" size={48}></CircleUser>
        </li>
      </ul>
    </div>
  );
}
