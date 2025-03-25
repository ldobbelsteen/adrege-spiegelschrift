export const DownloadFile = (props: { file: File; discard: () => void }) => {
  return (
    <div>
      <a
        href={window.URL.createObjectURL(props.file)}
        download={props.file.name}
      >
        <button type="button">Downloaden</button>
      </a>
      <button type="button" onClick={props.discard}>
        Terug
      </button>
    </div>
  );
};
