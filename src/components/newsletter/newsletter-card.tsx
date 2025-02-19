import { Pen } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

type props = {
  title: string;
  id: number;
  status: string;
  date: Date;
  handleConfigure: () => void;
};

const COLORS: Record<string, string> = {
  revise: "bg-ttickles-orange",
  approve: "bg-ttickles-blue",
};
const NewsletterCard = ({
  title,
  id,
  status,
  date,
  handleConfigure,
}: props) => {
  return (
    <div>
      <div className="bg-white rounded-lg p-5 flex flex-col justify-between h-fit border border-black/20">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <Checkbox />
            <Pen size={16} onClick={handleConfigure} />
          </div>
          <Link href={`newsletter/${id}`} className="text-4xl font-bold">
            {title}
          </Link>
          <div className="text-black/40">
            <div>Scheduled for</div>

            {date.toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
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
