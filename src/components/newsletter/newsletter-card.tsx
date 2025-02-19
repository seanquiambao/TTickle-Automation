import { Pen } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

type props = {
  title: string;
  id: number;
  status: string;
  handleConfigure: () => void;
};

const COLORS: Record<string, string> = {
  revise: "bg-ttickles-orange",
  approve: "bg-ttickles-blue",
};
const NewsletterCard = ({ title, id, status, handleConfigure }: props) => {
  return (
    <div>
      <div className="bg-white rounded-lg  p-4 flex flex-col justify-between h-48 border border-black/20">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <Checkbox />
            <Pen size={16} onClick={handleConfigure} />
          </div>
          <Link href={`newsletter/${id}`} className="text-4xl font-bold">
            {title}
          </Link>
          <div
            className={`${COLORS[status]} w-fit rounded-md text-white font-bold px-4 py-2 text-sm`}
          >
            {status + "d"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCard;
