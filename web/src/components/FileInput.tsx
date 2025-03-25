import { createRef } from "react";

export const FileInput = (props: {
  onInput: (file: File) => void;
  acceptMime: string;
}) => {
  const inputRef = createRef<HTMLInputElement>();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.files?.length === 1) {
      props.onInput(ev.currentTarget.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={props.acceptMime}
        onChange={handleChange}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <button type="button" onClick={() => inputRef.current?.click()}>
        Bestand selecteren
      </button>
    </>
  );
};
