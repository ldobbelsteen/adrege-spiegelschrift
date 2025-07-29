import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { DownloadFile } from "../DownloadFile";
import { FileInput } from "../FileInput";

export const PdfFlip = () => {
  const [result, setResult] = useState<File>();
  const [loading, setLoading] = useState(false);

  return (
    <section className="bg-primary text-white p-3 rounded d-flex flex-column align-items-start gap-2">
      <h3>Spiegel een PDF document</h3>
      {result ? (
        <DownloadFile
          file={result}
          discard={() => {
            setResult(undefined);
          }}
        />
      ) : loading ? (
        <span>Bezig...</span>
      ) : (
        <FileInput
          acceptMime="application/pdf"
          onInput={(file) => {
            setLoading(true);
            flipPdf(file)
              .then(setResult)
              .finally(() => {
                setLoading(false);
              })
              .catch((e: unknown) => {
                console.error(e);
              });
          }}
        />
      )}
    </section>
  );
};

const flipPdf = async (file: File): Promise<File> => {
  const data = await file.arrayBuffer();
  const document = await PDFDocument.load(data);

  const pages = document.getPages();
  for (const page of pages) {
    page.scale(-1, 1);
  }

  const flippedData = await document.save();
  const flippedName = `${file.name.split(".").slice(0, -1).join("")}-flipped.pdf`;
  const flippedFile = new File([flippedData], flippedName, {
    type: file.type,
  });

  return flippedFile;
};
