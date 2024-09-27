import React, { useEffect, useState } from "react";

export const TextFlip = () => {
  const [input, setInput] = useState("‮");
  const [spieken, setSpieken] = useState(false);

  const injectFlipUnicode = (text: string) =>
    text
      .split("\n")
      .map((s) => (!s.startsWith("‮") ? "‮" + s : s))
      .join("\n");

  const removeFlipUnicode = (text: string) =>
    text
      .split("\n")
      .map((s) => s.slice(1))
      .join("\n");

  useEffect(() => {
    if (spieken) {
      setInput(removeFlipUnicode);
    } else {
      setInput(injectFlipUnicode);
    }
  }, [spieken]);

  return (
    <section>
      <h3>Schrijft tekst in spiegelschrift</h3>
      <textarea
        value={input}
        style={{
          width: "100%",
          height: "12rem",
          resize: "none",
          fontSize: "x-large",
          fontFamily: spieken ? "GoBoom" : "mooBoG",
          textAlign: spieken ? "left" : "right",
        }}
        onChange={(ev) => {
          if (spieken) {
            setInput(ev.target.value);
          } else {
            setInput(injectFlipUnicode(ev.target.value));
          }
        }}
      ></textarea>
      <button
        type="button"
        onClick={() => {
          setSpieken((s) => !s);
        }}
      >
        {spieken ? "Spieken uitzetten" : "Spieken aanzetten"}
      </button>
    </section>
  );
};
