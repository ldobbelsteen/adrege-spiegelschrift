export const DownloadFile = (props: { file: File; discard: () => void }) => {
  return (
    <div className="d-flex gap-2">
      <a
        href={window.URL.createObjectURL(props.file)}
        download={props.file.name}
      >
        <button className="btn btn-secondary" type="button">Downloaden</button>
      </a>
      <button className="btn btn-secondary" type="button" onClick={props.discard}>
        Terug
      </button>
    </div>
  );
};
