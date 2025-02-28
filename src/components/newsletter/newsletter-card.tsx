import { Pen } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

type props = {
  title: string;
  id: string;
  status: string;
  handleConfigure: () => void;
  onClick: () => void;
  checked: boolean;
};
const COLORS: Record<string, string> = {
  revise: "bg-ttickles-orange",
  publish: "bg-ttickles-blue",
};
const NewsletterCard = ({
  title,
  id,
  status,
  handleConfigure,
  onClick,
  checked,
}: props) => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col justify-between h-fit border border-black/20">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <span onClick={onClick}>
            <Checkbox checked={checked} />
          </span>
          <Pen size={16} onClick={handleConfigure} />
        </div>
        <Link href={`newsletter/${id}`} className="text-4xl font-bold">
          {title}
        </Link>
        <div
          className={`${COLORS[status]} w-fit rounded-md text-white font-bold px-4 py-2 text-sm`}
        >
          {status}
        </div>
      </div>
    </div>
  );
};

export default NewsletterCard;
