import { PDFDocument } from "pdf-lib";

// PDF conversion
export const flipPdf = async (file: File): Promise<File> => {
  const data = await file.arrayBuffer();
  const document = await PDFDocument.load(data);

  const pages = document.getPages();
  for (const page of pages) {
    page.scale(-1, 1);
  }

  const flippedData = await document.save();
  const flippedName = `${file.name.split(".").slice(0, -1).join("")}-flipped.pdf`;
  return new File([flippedData], flippedName, { type: file.type });
};