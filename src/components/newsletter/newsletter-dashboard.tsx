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
import { useState, ChangeEvent } from "react";
import { QUESTIONS } from "@/data/newsletter/newsletter";
import { NewsletterMetadata, NewsletterType } from "@/types/newsletter";
import { HTMLInputs } from "@/types/inputs";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { Button } from "../ui/button";
import { MOCK } from "@/data/newsletter/newsletter";
import Toolbar from "./toolbar";
import { Popup } from "@/types/popup";

const NewsletterDashboard = () => {
  const [popup, setPopup] = useState<Popup>({
    visible: false,
  });

  const [newsletter, setNewsletter] = useState<NewsletterMetadata[]>(MOCK);
  const [selected, setSelected] = useState<number[]>([]);
  const handleChange = (e: ChangeEvent<HTMLInputs>, key: string) => {
    setNewsletter({ ...newsletter, [key]: e.target.value });
  };

  const handleConfigure = () => {
    setPopup({
      ...popup,
      visible: true,
    });
  };

  return (
    <div className="flex flex-col w-11/12 m-10 gap-4">
      <Label className="font-extrabold text-3xl">Newsletter</Label>
      <Toolbar
        popup={popup}
        setPopup={setPopup}
        newsletter={newsletter}
        setNewsletter={setNewsletter}
        selected={selected}
        setSelected={setSelected}
      />
      <div className="grid grid-cols-3 gap-4">
        {newsletter.map((item, index) => (
          <NewsletterCard
            key={index}
            status={item.status}
            title={item.subject}
            date={item.date}
            id={item.id}
            selected={selected}
            setSelected={setSelected}
            handleConfigure={handleConfigure}
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
