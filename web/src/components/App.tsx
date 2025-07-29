import "../styles/stylesheet.scss";
import { createRoot } from "react-dom/client";
import { FontFlip } from "./FontFlip";
import { PdfFlip } from "./PdfFlip";
import { TextFlip } from "./TextFlip";

const App = () => {
  return (
    <div className="container d-flex flex-column gap-3 my-3">
      <PdfFlip />
      <FontFlip />
      <TextFlip />
    </div>
  );
};

const container = document.getElementById("content");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
