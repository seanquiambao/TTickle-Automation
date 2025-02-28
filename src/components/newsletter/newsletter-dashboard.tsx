"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Select from "@/components/global/select";
import NewsletterCard from "./newsletter-card";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { useState, ChangeEvent, useEffect } from "react";
import { QUESTIONS } from "@/data/newsletter/newsletter";
import { NewsletterType } from "@/types/newsletter";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { Button } from "../ui/button";
import NewsletterToolbar from "./newsletter-toolbar";
import { Loader2 } from "lucide-react";

type props = {
  newsletter: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newsletterId?: string | any;
  newsletterStatus: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleConfigure: () => void;
};

const NewsletterDashboard = () => {
  const [newsletters, setNewsletters] = useState<props[]>([]);
  const [newsletterSearch, setSearch] = useState<props[]>([]);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState({
    visible: false,
  });

  const [newsletter, setNewsletter] = useState<NewsletterType>({
    to: "",
    subject: "",
    preview: "",
    body: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setNewsletter({ ...newsletter, [key]: e.target.value });
  };

  const handleConfigure = () => {
    console.log(popup);
    setPopup({
      ...popup,
      visible: true,
    });
  };

  useEffect(() => {
    fetch("/api/newsletter", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setNewsletters(data.newsletters);
        setSearch(data.newsletters);
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col w-10/12 m-10 gap-4">
      <Label className="font-extrabold text-3xl">Newsletter</Label>
      <NewsletterToolbar
        data={newsletters}
        setSearch={setSearch}
        checked={checked}
        setChecked={setChecked}
        setNewsletters={setNewsletters}
      />
      {!loading ? (
        <div className="grid grid-cols-3 gap-5">
          {newsletterSearch.map(
            ({ newsletter, newsletterId, newsletterStatus }, index) => (
              <NewsletterCard
                title={newsletter === " " ? "Untitled" : newsletter}
                id={newsletterId ?? index.toString()}
                handleConfigure={handleConfigure}
                status={newsletterStatus || "revise"}
                onClick={() => {
                  setChecked({
                    ...checked,
                    [newsletterId]: !checked[newsletterId],
                  });
                }}
                checked={checked[newsletterId as keyof typeof checked]}
                key={index}
              />
            ),
          )}
        </div>
      ) : (
        <Loader2 size={35} />
      )}
      <AlertDialog open={popup.visible}>
        <AlertDialogContent className="flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>Configure Newsletter</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="flex flex-col gap-4">
            {QUESTIONS.map((question, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Label className="font-bold">{question.title}</Label>
                {question.type === "input" && (
                  <Input
                    type="text"
                    value={newsletter[question.title as keyof NewsletterType]}
                    onChange={(e) => handleChange(e, question.title)}
                  />
                )}
                {question.type === "select" && (
                  <Select
                    options={[
                      { label: "BlueHeart", value: "blue" },
                      { label: "Sean.gov", value: "sean" },
                      { label: "Jude's Hosiptial", value: "jude" },
                    ]}
                    onChange={(selected) =>
                      console.log("Selected category:", selected)
                    }
                    placeholder="Select a Recipient"
                  />
                )}
              </div>
            ))}
          </AlertDialogDescription>

          <div className="flex flex-row self-end gap-2">
            <AlertDialogCancel
              onClick={() => setPopup({ ...popup, visible: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction>
              <Button
                onClick={() => setPopup({ ...popup, visible: false })}
                className="bg-ttickles-blue text-white hover:bg-ttickles-blue"
              >
                Submit
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsletterDashboard;
