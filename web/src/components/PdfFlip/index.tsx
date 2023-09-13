import { PDFDocument } from "pdf-lib";
import React, { createRef, useState } from "react";

const pdfMime = "application/pdf";

export const PdfFlip = () => {
  const [result, setResult] = useState<File>();
  const [loading, setLoading] = useState(false);

  return (
    <section>
      <h3>Spiegel een PDF document</h3>
      {result ? (
        <div>
          <a href={window.URL.createObjectURL(result)} download={result.name}>
            <button>Klaar! Downloaden?</button>
          </a>
          <button onClick={() => setResult(undefined)}>Terug</button>
        </div>
      ) : loading ? (
        <span>Spiegelen...</span>
      ) : (
        <FileInput
          onInput={(file) => {
            setLoading(true);
            flipPdf(file)
              .then(setResult)
              .finally(() => setLoading(false))
              .catch(console.error);
          }}
        />
      )}
    </section>
  );
};

const FileInput = (props: { onInput: (file: File) => void }) => {
  const inputRef = createRef<HTMLInputElement>();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.files?.length === 1) {
      props.onInput(ev.currentTarget.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={pdfMime}
        onChange={handleChange}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <button type="button" onClick={() => inputRef.current?.click()}>
        Selecteren
      </button>
    </>
  );
};

const flipPdf = async (file: File): Promise<File> => {
  const data = await file.arrayBuffer();
  const document = await PDFDocument.load(data);

  const pages = document.getPages();
  pages.forEach((page) => {
    page.scale(-1, 1);
  });

  const flippedData = await document.save();
  const flippedName =
    file.name.split(".").slice(0, -1).join("") + "-flipped.pdf";
  const flippedFile = new File([flippedData], flippedName, {
    type: pdfMime,
  });

  return flippedFile;
};
