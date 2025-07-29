export const DownloadFile = (props: { name: string, file: File; discard: () => void }) => {
  return (
    <div className="d-flex gap-2 align-items-center w-100">
      <span>{props.name}</span>
      <a
      className="ms-auto"
        href={window.URL.createObjectURL(props.file)}
        download={props.file.name}
      >
        <button className="btn btn-outline-light" type="button">
          <i className="bi bi-download"></i>
        </button>
      </a>
      <button className="btn btn-outline-light" type="button" onClick={props.discard}>
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
};
