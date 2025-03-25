import "../styles/styles.scss";
import { createRoot } from "react-dom/client";
import { FontFlip } from "./FontFlip";
import { PdfFlip } from "./PdfFlip";
import { TextFlip } from "./TextFlip";

const App = () => {
  return (
    <main>
      <h1>Spiegelschrift tools</h1>
      <PdfFlip />
      <FontFlip />
      <TextFlip />
    </main>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
