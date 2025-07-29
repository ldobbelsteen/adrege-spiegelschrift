import "../styles/stylesheet.scss";
import { createRoot } from "react-dom/client";
import { FontFlip } from "./FontFlip";
import { PdfFlip } from "./PdfFlip";
import { TextFlip } from "./TextFlip";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

const App = () => {
  return (
    <div className="container my-3">
      <Tab.Container defaultActiveKey="pdf">
        <Nav variant="tabs" id="tabs">
          <Nav.Item>
            <Nav.Link eventKey="pdf">PDF</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="font">Lettertype</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="text">Schrijven</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="tab-content">
          <Tab.Pane eventKey="pdf">
            <PdfFlip />
          </Tab.Pane>
          <Tab.Pane eventKey="font">
            <FontFlip />
          </Tab.Pane>
          <Tab.Pane eventKey="text">
            <TextFlip />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

const container = document.getElementById("content");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
