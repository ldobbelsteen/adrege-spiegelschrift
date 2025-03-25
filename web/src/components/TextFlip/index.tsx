import { useEffect, useState } from "react";

function injectFlipUnicode(text: string) {
  return text
    .split("\n")
    .map((s) => (!s.startsWith("‮") ? `‮${s}` : s))
    .join("\n");
}

function removeFlipUnicode(text: string) {
  return text
    .split("\n")
    .map((s) => s.slice(1))
    .join("\n");
}

export const TextFlip = () => {
  const [input, setInput] = useState("‮");
  const [spieken, setSpieken] = useState(false);

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
      />
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
