import "../styles/stylesheet.scss";
import { createRoot } from "react-dom/client";
import { TextFlip } from "./TextFlip";
import { Flipper } from "./Flip/Flipper";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

const App = () => {
  return (
    <div className="container my-3">
      <Tab.Container defaultActiveKey="flip">
        <Nav variant="tabs" id="tabs">
          <Nav.Item>
            <Nav.Link eventKey="flip">Spiegelen</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="text">Schrijven</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="tab-content">
          <Tab.Pane eventKey="flip">
            <Flipper />
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
