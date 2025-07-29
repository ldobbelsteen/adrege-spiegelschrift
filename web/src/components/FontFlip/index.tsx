import { useState } from "react";
import { DownloadFile } from "../DownloadFile";
import { FileInput } from "../FileInput";

export const FontFlip = () => {
  const [results, setResults] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <section className="bg-primary text-white p-3 rounded d-flex flex-column align-items-start gap-2">
      <h3>Spiegel een TTF lettertype</h3>
      <div className="d-flex gap-4 w-100">
        <FileInput
          acceptMime="font/ttf"
          multiple
          onInput={async (files) => {
            setLoading(true);
            try {
              const flippedFiles = await Promise.all(files.map(flipFont));
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
        </div>
      </div>
    </section>
  );
};

const flipFont = async (file: File): Promise<File> => {
  const formData = new FormData();
  formData.append("font", file, file.name);
  const response = await fetch("/api/flip-font", {
    method: "POST",
    body: formData,
  });
  const filename = response.headers
    .get("Content-Disposition")
    ?.split("filename=")[1]
    .split(";")[0];

  if (!filename) {
    throw new Error("no filename found in response headers");
  }

  const blob = await response.blob();
  return new File([blob], filename);
};
