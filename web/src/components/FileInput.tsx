import React, { createRef } from "react";
import { pdfMime } from "../pdf";

export const FileInput = (props: { onInput: (file: File) => void }) => {
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
        accept={pdfMime}
        onChange={handleChange}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <button type="button" onClick={() => inputRef.current?.click()}>
        Selecteren
      </button>
    </>
  );
};
