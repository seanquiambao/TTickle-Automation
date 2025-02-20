"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { EventType } from "@/types/event";
import { MOCK } from "@/data/newsletter/event";

interface contextType {
  eventsContext: EventType[];
  setEventsContext: (content: EventType[]) => void;
  formattedEvents: string;
}

const EventsContext = createContext<contextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [eventsContext, setEventsContext] = useState<EventType[]>(MOCK || []);
  const formattedEvents = eventsContext
    .map(
      (event, index) =>
        `Event ${index + 1}: ${event.name}, ${event.description}, at ${event.location} on ${event.date}`,
    )
    .join("\n");

  return (
    <EventsContext.Provider
      value={{ eventsContext, setEventsContext, formattedEvents }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEventContext must be used within an ContextProvider");
  }
  return context;
}
