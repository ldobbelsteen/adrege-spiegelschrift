import React, { useState } from "react";
import { pdfFlip } from "../pdf";
import { FileInput } from "./FileInput";
import { LoadingText } from "./LoadingText";

export const FlipDocument = () => {
  const [result, setResult] = useState<File>();
  const [loading, setLoading] = useState(false);

  if (result) {
    return (
      <>
        <span>{result.name}</span>
        {
          // eslint-disable-next-line
        } <a href={window.URL.createObjectURL(result)} download={result.name}>
          <button>Opslaan</button>
        </a>
        <button onClick={() => setResult(undefined)}>Terug</button>
      </>
    );
  }

  if (loading) {
    return <LoadingText text="Flippen" />;
  }

  return (
    <FileInput
      onInput={(file) => {
        setLoading(true);
        pdfFlip(file)
          .then(setResult)
          .finally(() => setLoading(false))
          .catch(console.error);
      }}
    />
  );
};
