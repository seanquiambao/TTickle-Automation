import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <p className="text-3xl font-bold text-ttickles-darkblue">Loading</p>
      <LoaderCircle className="animate-spin text-ttickles-blue" />
    </div>
  );
};

export default Loading;
