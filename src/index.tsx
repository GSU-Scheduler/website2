import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
