import { useDropzone } from "react-dropzone";

export const FileInput = (props: {
  onInput: (files: File[]) => void;
  acceptMime: string;
  multiple?: boolean;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { [props.acceptMime]: [] },
    multiple: props.multiple ?? false,
    onDrop: (acceptedFiles) => {
      props.onInput(acceptedFiles);
    },
  });

  // Handle manual file selection (click)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      props.onInput(Array.from(e.target.files));
      e.target.value = ""; // allow re-selecting the same file(s)
    }
  };

  return (
    <div{...getRootProps()} className="w-100">
      <div 
          className={`d-flex flex-column align-items-center justify-content-center border border-5 border-secondary rounded-3 py-5 px-4 transition ${isDragActive ? "bg-light" : "bg-primary-subtle"}`}
          style={{ cursor: "pointer", minHeight: 180, borderStyle: "dotted" }}>
        <input
          {...getInputProps()}
          onChange={handleInputChange}
        />
        <div className={`fs-1 ${isDragActive ? "text-primary" : "text-dark" }`}>
          <i className="bi bi-cloud-arrow-up"></i>
        </div>
        <div className={`fw-bold ${isDragActive ? "text-primary" : "text-dark" }`}>
          {isDragActive
            ? "Laat hier je bestanden los..."
            : "Sleep bestanden hierheen of klik om te selecteren"}
        </div>
      </div>
      <span>Ondersteunde types: {props.acceptMime}</span>
    </div>
  );
};
