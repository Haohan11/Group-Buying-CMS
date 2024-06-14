import Logo from "../logo";

const ScreenLoad = () => {
  return (
    <div
      className="vh-100 flex-column flex-center fs-2"
      style={{ color: "grey" }}
    >
      <Logo className="mb-6" style={{ width: "clamp(100px, 10vw, 150px)" }} />
      Loading...
    </div>
  );
};

export default ScreenLoad;
