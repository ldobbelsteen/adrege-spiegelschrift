import { PDFDocument } from "pdf-lib";

export const pdfMime = "application/pdf";

export const pdfFlip = async (file: File): Promise<File> => {
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
