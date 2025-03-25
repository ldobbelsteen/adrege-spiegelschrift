import { useState } from "react";
import { DownloadFile } from "../DownloadFile";
import { FileInput } from "../FileInput";

export const FontFlip = () => {
  const [result, setResult] = useState<File>();
  const [loading, setLoading] = useState(false);

  return (
    <section>
      <h3>Spiegel een TTF lettertype</h3>
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
          acceptMime="font/ttf"
          onInput={(file) => {
            setLoading(true);
            flipFont(file)
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
