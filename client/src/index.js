import React from "react";
import ReactDOM from "react-dom";
import { UserContextProvider } from "./components/service/userContext";
import App from "./App";
import "./styles/index.css";
import "./styles/modal.css";
import "./styles/pages.css";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
