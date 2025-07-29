export const DownloadFile = (props: { file: File; discard: () => void }) => {
  return (
    <div className="d-flex gap-2 align-items-center w-100">
      <span>{props.file.name.replace("-flipped", "")}</span>
      <a
      className="ms-auto"
        href={window.URL.createObjectURL(props.file)}
        download={props.file.name}
      >
        <button className="btn btn-secondary" type="button">
          <i className="bi bi-download"></i>
        </button>
      </a>
      <button className="btn btn-secondary" type="button" onClick={props.discard}>
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};
