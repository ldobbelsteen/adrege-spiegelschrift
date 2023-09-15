import React from "react";

export const DownloadFile = (props: { file: File; discard: () => void }) => {
  return (
    <div>
      <a
        href={window.URL.createObjectURL(props.file)}
        download={props.file.name}
      >
        <button>Downloaden</button>
      </a>
      <button onClick={props.discard}>Terug</button>
    </div>
  );
};
