import { Popup } from "@/types/popup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Plus, Trash } from "lucide-react";
import { NewsletterMetadata } from "@/types/newsletter";
import { STATUSES } from "@/data/newsletter/toolbar";

type props = {
  popup: Popup;
  setPopup: (value: Popup) => void;
  selected: number[];
  setSelected: (value: number[]) => void;
  newsletter: NewsletterMetadata[];
  setNewsletter: (
    value:
      | NewsletterMetadata[]
      | ((prev: NewsletterMetadata[]) => NewsletterMetadata[]),
  ) => void;
};
const Toolbar = ({
  popup,
  setPopup,
  selected,
  setSelected,
  setNewsletter,
}: props) => {
  const handleAdd = () => {
    setPopup({
      ...popup,
      visible: true,
    });
  };

  const handleStatus = (newStatus: string) => {
    console.log(newStatus);
    console.log("Selected:", selected);
    setNewsletter((prev: NewsletterMetadata[]) =>
      prev.map((item: NewsletterMetadata) =>
        selected.includes(item.id) ? { ...item, status: newStatus } : item,
      ),
    );
    setSelected([]);
  };
  return (
    <div className="flex flex-row items-center gap-2">
      {STATUSES.map((item, index) => (
        <Button
          key={index}
          onClick={() => handleStatus(item.status)}
          className={`${item.color} font-bold textwhite`}
        >
          {item.status}
        </Button>
      ))}
      <Input placeholder="search" />
      <Select />
      <Plus size={48} className="cursor-pointer" onClick={handleAdd} />
      <Trash size={48} className="cursor-pointer" />
    </div>
  );
};

export default Toolbar;
