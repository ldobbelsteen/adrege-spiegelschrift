import React, { createRef } from "react";

export const FontFlip = () => {
  return (
    <section>
      <h3>Spiegel een TTF lettertype</h3>
      <FileInput />
    </section>
  );
};

const FileInput = () => {
  const inputRef = createRef<HTMLInputElement>();
  const formRef = createRef<HTMLFormElement>();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.currentTarget.files?.length === 1) {
      formRef.current?.submit();
    }
  };

  return (
    <form
      method="post"
      action="/api/flip-font"
      encType="multipart/form-data"
      ref={formRef}
    >
      <input
        name="font"
        type="file"
        accept="font/ttf"
        onChange={handleChange}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <button type="button" onClick={() => inputRef.current?.click()}>
        Selecteren
      </button>
    </form>
  );
};
