import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Input } from "../ui/input";
import Select from "@/components/global/select";
import { STATUSES } from "@/data/newsletter/toolbar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearch: (value: any[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];

  checked: { [key: string]: boolean };
  setChecked: (value: { [key: string]: boolean }) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setNewsletters: (value: any[] | ((prev: any[]) => any[])) => void;
}

const NewsletterToolbar = ({
  data,
  setSearch,
  checked,
  setNewsletters,
}: props) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [popup, setPopup] = useState({
    title: "",
    text: "",
    color: "",
    visible: false,
    onClick: () => {},
    button: "",
  });

  const ids = Object.keys(checked).filter((id) => checked[id]);

  const handleChange = (e: string) => {
    setValue(e);
    setSearch(
      e === ""
        ? data
        : data.filter(({ newsletter }) =>
            newsletter.toLowerCase().includes(e.toLowerCase()),
          ),
    );
  };

  const handleStatus = async (newStatus: string) => {
    await fetch("/api/newsletter", {
      method: "PUT",
      body: JSON.stringify({
        newsletterIds: ids,
        newStatus: newStatus,
      }),
    });
    setNewsletters((prev) => {
      const updated = prev.map((item) =>
        checked[item.newsletterId]
          ? { ...item, newsletterStatus: newStatus }
          : item,
      );

      setSearch([...updated]);
      return [...updated];
    });
  };

  const handleNewletter = () => {
    fetch("/api/newsletter", {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Created newsletter:", data);

        router.push(`newsletter/${data.newsletterId}`);
      })
      .catch((error) => {
        console.error("Error creating newsletters:", error);
      });
  };

  const deleteNewsletter = () => {
    const keep = data.filter((item) => !ids.includes(item.newsletterId));
    console.log("keep", keep);
    setSearch(keep);
    setNewsletters(keep);
    fetch("/api/newsletter", {
      method: "DELETE",
      body: JSON.stringify({ newsletterId: ids }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      })
      .then(() => {
        toast.success("Deleted successfully");
      })
      .catch((error) => {
        console.error("Error creating newsletters:", error);
      });
  };

  const confirmDelete = () => {
    if (ids.length === 0) {
      alert("No newsletters selected for deletion.");
      return;
    }

    setPopup({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this newsletter This action is irreversible.",
      color: "red",
      visible: true,
      onClick: deleteNewsletter,
      button: "Confirm",
    });
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
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="search"
      />
      <Select
        options={STATUSES.map(({ status }) => ({
          label: status,
          value: status,
        }))}
        onChange={(selected) => {
          setSearch(
            selected === "All"
              ? data
              : data.filter((item) => item.newsletterStatus === selected),
          );
        }}
        placeholder="filter by status"
      />
      <Plus
        size={48}
        onClick={handleNewletter}
        className="cursor-pointer hover:text-blue-500 duration-300"
      />
      <Trash
        size={48}
        onClick={confirmDelete}
        className="cursor-pointer hover:text-red-500 duration-300"
      />
      <AlertDialog open={popup.visible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>{popup.text}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setPopup({ ...popup, visible: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                popup.onClick();
                setPopup({ ...popup, visible: false });
              }}
            >
              {popup.button}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsletterToolbar;
