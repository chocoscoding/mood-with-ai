import Spinner from "./Spinner";

const LoadingState = ({ state }: { state: "loading" | "deleting" | "idle" }) => {
  if (state === "loading")
    return (
      <div className="sticky top-0 w-full bg-green-400 text-center text-green-900 flex justify-center gap-2 items-center p-1">
        <p>Saving</p>
        <Spinner />
      </div>
    );
  if (state === "deleting")
    return (
      <div className="sticky top-0 w-full bg-yellow-400 text-center text-green-900 flex justify-center gap-2 items-center p-1">
        <p>Deleting</p>
        <Spinner />
      </div>
    );
  return <></>;
};
export default LoadingState;
