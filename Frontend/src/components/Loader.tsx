import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <ClipLoader color="#3498db" size={50} />
    </div>
  );
};

export default Loader;
