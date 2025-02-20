"use client";
import { Plus, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Event from "./event";
import { useState } from "react";
import { Popup } from "@/types/popup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QUESTIONS } from "@/data/newsletter/event";
import { ChangeEvent } from "react";
import { EventType } from "@/types/event";
import { useEventContext } from "./context";

type props = {
  setEvent: (value: (prevEvent: EventType) => EventType) => void;
};

const EventModal = ({ setEvent }: props) => {
  return (
    <>
      {QUESTIONS.map((question, index) => (
        <div key={index} className="flex flex-col gap-2 mb-2">
          <Label className="font-bold">{question.title}</Label>
          {question.type === "input" && (
            <Input
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEvent((prevEvent: EventType) => ({
                  ...prevEvent,
                  [question.key]: e.target.value as EventType[keyof EventType],
                }));
              }}
            />
          )}
          {question.type === "textarea" && (
            <Textarea
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setEvent((prevEvent: EventType) => ({
                  ...prevEvent,
                  [question.key as keyof EventType]: e.target.value,
                }));
              }}
            />
          )}
        </div>
      ))}
    </>
  );
};

const Events = () => {
  const { eventsContext, setEventsContext } = useEventContext();
  const [events, setEvents] = useState<EventType[]>(eventsContext);
  const [event, setEvent] = useState<EventType>(() => ({
    name: "",
    description: "",
    location: "",
    date: "",
  }));

  const [popup, setPopup] = useState<Popup>({
    title: "",
    message: "",
    visible: false,
    cancel: false,
    submit: false,
  });

  const handleSubmit = () => {
    console.log("Current Event State:", event); // Debugging
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, event];
      setEventsContext(updatedEvents);
      return updatedEvents;
    });
    setEvent({ name: "", description: "", location: "", date: "" }); // Reset form
    setPopup({ ...popup, visible: false }); // Close modal
  };

  return (
    <div className="w-full flex flex-col bg-black/5 p-4 rounded-md border border-black/20">
      <div
        className="flex flex-col items-center bg-white border border-black/20 font-bold rounded-md p-4 cursor-pointer"
        onClick={() =>
          setPopup({
            title: "Add Event",
            visible: true,
            message: <EventModal setEvent={setEvent} />,
            cancel: true,
            submit: true,
          })
        }
      >
        <Plus size={32} />
        Add Event
      </div>
      <div className="flex flex-row items-center text-black/20 text-xs gap-1 self-end">
        What is this?
        <Info
          size={12}
          className="cursor-pointer"
          onClick={() =>
            setPopup({
              title: "About Adding Event",
              message:
                "Add an event describing what your organization have done in the past weeks! TTickle will use these events to summarize in your newsletter!",
              visible: true,
              cancel: true,
              submit: false,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        {events.map((event, index) => (
          <Event
            name={event.name}
            location={event.location}
            date={event.date}
            key={index}
          />
        ))}
      </div>
      <AlertDialog open={popup.visible}>
        <AlertDialogContent className="flex flex-col gap-3">
          <AlertDialogTitle>{popup.title}</AlertDialogTitle>
          <AlertDialogDescription>{popup.message}</AlertDialogDescription>
          <div className="flex flex-row self-end gap-2">
            {popup.cancel && (
              <AlertDialogCancel
                onClick={() => setPopup({ ...popup, visible: false })}
              >
                Exit
              </AlertDialogCancel>
            )}
            {popup.submit && (
              <AlertDialogAction onClick={handleSubmit}>
                Submit
              </AlertDialogAction>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Events;
