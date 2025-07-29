import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { DownloadFile } from "../DownloadFile";
import { FileInput } from "../FileInput";
import JSZip from "jszip";

export const PdfFlip = () => {
  const [results, setResults] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    for (const file of results) {
      zip.file(file.name, file);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spiegelschrift-pdfs.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-primary text-white p-3 rounded-end rounded-bottom d-flex flex-column align-items-start gap-2">
      <h3>Spiegel PDF documenten</h3>
      <div className="d-flex gap-4 w-100">
        <FileInput
          acceptMime="application/pdf"
          multiple
          onInput={async (files) => {
            setLoading(true);
            try {
              const flippedFiles = await Promise.all(files.map(flipPdf));
              setResults((prev) => [...prev, ...flippedFiles]);
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          }}
        />
        <div className="w-100 d-flex flex-column gap-2">
          {results.map((file, idx) => (
            <DownloadFile
              key={file.name + idx}
              file={file}
              discard={() => setResults(results.filter((_, i) => i !== idx))}
            />
          ))}
          {loading && <span>Bezig...</span>}
          
          {results.length > 1 && (
            <button
              className="btn btn-secondary mt-auto align-self-end"
              type="button"
              onClick={handleDownloadAll}
            >
              <i className="bi bi-download me-2"></i>Download alles</button>
          )}
        </div>
      </div>
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
