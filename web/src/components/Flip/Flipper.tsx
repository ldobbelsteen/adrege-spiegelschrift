import { useState } from "react";
import { DownloadFile } from "../DownloadFile";
import { FileInput } from "../FileInput";
import JSZip from "jszip";

import { flipPdf } from "./FlipPdf";
import { flipTtf } from "./FlipTtf";
import { convertDocxToPdf } from "./DocxToPdf"; 

type FlippedResult = {
  originalName: string;
  file: File;
};

export const Flipper = () => {
  const [results, setResults] = useState<FlippedResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: File[]) => {
    setLoading(true);
    try {
      const processed = await Promise.all(
        files.map(async (file) => {
          const ext = file.name.toLowerCase();
          try {
            if (file.type === "application/pdf" || ext.endsWith(".pdf")) {
              const flipped = await flipPdf(file);
              return { originalName: file.name, file: flipped };
            } else if (
              file.type === "font/ttf" ||
              ext.endsWith(".ttf") ||
              file.type === "application/x-font-ttf"
            ) {
              const flipped = await flipTtf(file);
              return { originalName: file.name, file: flipped };
            } else if (
              file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              ext.endsWith(".docx")
            ) {
              const pdf = await convertDocxToPdf(file);
              const flipped = await flipPdf(pdf);
              return { originalName: file.name, file: flipped };
            }
          } catch (err) {
            console.error("Error processing file:", file.name, err);
          }
          return null;
        })
      );
      setResults((prev) => [
        ...prev,
        ...processed.filter((f): f is FlippedResult => !!f),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    for (const result of results) {
      zip.file(result.file.name, result.file);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spiegelschrift-bestanden.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-primary text-white p-3 rounded-end rounded-bottom d-flex flex-column gap-2"
      style={{ height: "75vh" }}>
      <h3>Spiegel bestanden</h3>
      <div className="w-100 d-flex gap-2 h-100">
        {/* File input */}
        <FileInput
          acceptMime=".pdf,.ttf,.docx,application/pdf,font/ttf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onInput={handleFiles}
        />
        <div className="d-flex flex-column gap-2 w-100">
          <div className="d-flex flex-column gap-2 p-2 border border-3 border-secondary rounded overflow-auto"
            style={{ height: "80%" }}>
            {/* Downloads */}
            {results.map((result, idx) => (
              <div
                key={result.file.name + idx}
                className="d-flex align-items-center w-100 gap-2"
              >
                <DownloadFile
                  name={result.originalName}
                  file={result.file}
                  discard={() =>
                    setResults(results.filter((_, i) => i !== idx))
                  }
                />
              </div>
            ))}
            {loading && <span>Bezig...</span>}
          </div>

          <div className="w-100 d-flex gap-2 justify-content-end align-items-center">
            {/* Download all and Clear all */}
            <span className="me-auto">{results.length} item{results.length === 1 ? "" : "s"}</span>
            <button
              className="btn btn-outline-light"
              type="button"
              {...results.length === 0 ? { disabled: true } : {}}
              onClick={handleDownloadAll}
            >
              <i className="bi bi-download me-2"></i>Download alles
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              {...results.length === 0 ? { disabled: true } : {}}
              onClick={() => setResults([])}
            >
              <i className="bi bi-x-circle me-2"></i>Verwijder alles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
