// TTF conversion
export const flipTtf = async (file: File): Promise<File> => {
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