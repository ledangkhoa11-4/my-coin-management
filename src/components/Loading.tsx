import { CSSProperties } from "react";
import { DotLoader } from "react-spinners";

const Loading = () => {
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center" style={{ backgroundColor: "rgb(203 203 203 / 39%)" }}>
      <DotLoader color={"#ff0000"} loading={true} cssOverride={override} size={60} aria-label="Loading Spinner" data-testid="loader" />;
    </div>
  );
};
export default Loading;
