import React, { useState } from "react";

export const TextFlip = () => {
  const [input, setInput] = useState("");

  return (
    <section>
      <h3>Spiegel een stuk tekst</h3>
      <textarea
        style={{ width: "100%", height: "8rem" }}
        value={input}
        onChange={(ev) => setInput(ev.target.value)}
      ></textarea>
      <button
        type="button"
        onClick={() =>
          setInput((text) => {
            const lines = text.split("\n");
            const reversed = lines.map((line) =>
              line.split("").reverse().join(""),
            );
            return reversed.join("\n");
          })
        }
      >
        Spiegel
      </button>
    </section>
  );
};
