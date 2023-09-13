import "../styles.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { FlipDocument } from "./FlipDocument";
import { FlipFontForm } from "./FlipFontForm";

const App = () => {
  return (
    <main>
      <FlipDocument />
      <FlipFontForm />
    </main>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
