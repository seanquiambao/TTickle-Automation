"use client";
import { Plus, Trash } from "lucide-react";
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
import { HTMLInputs } from "@/types/inputs";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { Button } from "../ui/button";

const NewsletterDashboard = () => {
  const [newsletters, setNewsletters] = useState([]);

  const [popup, setPopup] = useState({
    visible: false,
  });

  const [newsletter, setNewsletter] = useState<NewsletterType>({
    to: "",
    subject: "",
    preview: "",
    body: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputs>, key: string) => {
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
    fetch("/api/document", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setNewsletters(data.newsletters);
      })
      .catch((error) => {
        console.error("Error fetching newsletters:", error);
      });
  }, []);

  return (
    <div className="flex flex-col w-10/12 m-10 gap-4">
      <Label className="font-extrabold text-3xl">Newsletter</Label>
      <div className="flex flex-row items-center gap-2">
        <Input placeholder="search" />
        <Select />
        <Plus size={48} className="cursor-pointer" />
        <Trash size={48} className="cursor-pointer" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <NewsletterCard
          title="Giving Guide 2024"
          id={2}
          handleConfigure={handleConfigure}
        />
        {newsletters.map((newsletter, index) => (
          <NewsletterCard
            title="hello world"
            id={index + 2}
            handleConfigure={handleConfigure}
            key={index}
          />
        ))}
      </div>

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
                {question.type === "select" && <Select />}
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
