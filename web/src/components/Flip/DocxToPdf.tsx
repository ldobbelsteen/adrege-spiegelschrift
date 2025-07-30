// DOCX to PDF conversion
export const convertDocxToPdf = async (file: File): Promise<File> => {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetch("/api/convert-docx", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Conversion failed: ${response.statusText}`);
  }

  const filename = response.headers
    .get("Content-Disposition")
    ?.split("filename=")[1]
    ?.split(";")[0]
    ?.replace(/"/g, ""); // Remove quotes if present

  if (!filename) {
    throw new Error("No filename found in response headers");
  }

  const blob = await response.blob();
  return new File([blob], filename, { type: "application/pdf" });
};
