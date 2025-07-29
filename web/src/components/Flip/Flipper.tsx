import { useState } from "react";
import { DownloadFile } from "../DownloadFile";
import { FileInput } from "../FileInput";
import JSZip from "jszip";

import { flipPdf } from "./FlipPdf";
import { flipTtf } from "./FlipTtf";

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
          if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
            const flipped = await flipPdf(file);
            return { originalName: file.name, file: flipped };
          } else if (
            file.type === "font/ttf" ||
            file.name.endsWith(".ttf") ||
            file.type === "application/x-font-ttf"
          ) {
            const flipped = await flipTtf(file);
            return { originalName: file.name, file: flipped };
          }
          // Ignore unsupported files
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
    <section className="bg-primary text-white p-3 rounded-end rounded-bottom d-flex flex-column align-items-start gap-2">
      <h3>Spiegel bestanden</h3>
      <div className="w-100 d-flex gap-2">
        {/* File input */}
        <FileInput
          acceptMime=".pdf,.ttf,application/pdf,font/ttf"
          multiple
          onInput={handleFiles}
        />
        <div className="d-flex flex-column gap-2 w-100">
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

          <div className="w-100 d-flex gap-2 justify-content-end mt-auto">
            {/* Download all and Clear all */}
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


