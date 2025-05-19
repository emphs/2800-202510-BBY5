const LocateButton = ({ onLocate }) => (
  <button
    className="btn btn-primary position-absolute end-0 top-0 m-3"
    style={{ zIndex: 400 }}
    onClick={onLocate}
    type="button"
  >
    Locate
  </button>
);

export default LocateButton;