"use client";

import { useState } from "react";
import Events from "./events";
import { PlateEditor } from "@/components/editor/plate-editor";
import { EventsProvider } from "./context";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const Creator = () => {
  const [data, setData] = useState<string[]>([]);
  // const { EventsContext } = useEventContext()
  // const [events, setEvents] = useState(EventsContext)
  // console.log("context: ", events)
  // const [message, setMessage] = useState("");
  // const [prompt, setPrompt] = useState("");
  // const [selectedPrompt, setSelectedPrompt] = useState("");
  // const [selectedText, setSelectedText] = useState("");
  const [error, setError] = useState(false);
  const [loading, setIsLoading] = useState(true);
  // const [loadingSelected, setLoadingSelected] = useState(false);

  // const [allEvents, setEvents] = useState<EventType[]>([]);
  // console.log(allEvents);
  // console.log("text selected", selectedText);
  // console.log(message);

  // const formattedEvents = allEvents
  //   .map(
  //     (event, index) =>
  //       `Event ${index + 1}: ${event.name}, ${event.description}, at ${event.location} on ${event.date}`,
  //   )
  //   .join("\n");

  // console.log(formattedEvents);

  // const generateAI = async (customPrompt: string, isSelected = false) => {
  //   if (!customPrompt.trim()) return; // prevent empty request

  //   const finalPrompt =
  //     selectedText && isSelected
  //       ? `Context: ${selectedText}\nUser Request: ${customPrompt}`
  //       : `${customPrompt}\nEvents: ${formattedEvents}`;

  //   if (isSelected) {
  //     setLoadingSelected(true);
  //   } else {
  //     setIsLoading(true);
  //   }

  //   try {
  //     const res = await fetch("/api/ollama/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ prompt: finalPrompt }),
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! Status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     console.log(data);
  //     setMessage(data.items || "No response received.");
  //   } catch (error) {
  //     console.error("Error fetching AI response:", error);
  //     // setMessage("Failed to fetch response.");
  //     setError(true);
  //   } finally {
  //     if (isSelected) {
  //       setLoadingSelected(false);
  //     } else {
  //       setIsLoading(false);
  //     } // Re-enable button
  //   }
  // };

  // const handleEventsChange = (updatedEvents: EventType[]) => {
  //   console.log("Updated Events List in Parent:", updatedEvents);
  //   // setEvents(updatedEvents);
  //   // setEvents(updatedEvents)
  // };

  const generateDocument = async () => {
    if (!data.length) return;

    setIsLoading(false);

    try {
      const res = await fetch("/api/document/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document: data }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      console.error("Error creating Document:", error);
      setError(true);
    } finally {
      setIsLoading(true);
    }
  };
  const handleChange = (value: string) => {
    console.log("Updated", value);
    setData(value.split("\n"));
  };

  if (error) {
    console.log("Failed");
    // replace with a toast
  }

  return (
    <EventsProvider>
      <div className="flex flex-col gap-4 h-full w-full">
        <div className="font-extrabold text-3xl mb-8">Newsletter</div>
        <div className="flex flex-row h-full gap-2 w-2/3 ">
          <div className="flex flex-col bg-black/5 p-4 rounded-md border border-black/20 w-full gap-4 h-full">
            <PlateEditor onChange={handleChange} />
          </div>
          <Events />
        </div>
        {loading ? (
          <Button
            disabled={!data.length}
            onClick={generateDocument}
            className="bg-ttickles-darkblue text-white px-4 py-2 rounded disabled:opacity-50 w-fit"
          >
            Save
          </Button>
        ) : (
          <Loader className="animate-spin" />
        )}
      </div>
    </EventsProvider>
  );
};

export default Creator;

// const TypingEffect = ({
//   message,
//   setMessage,
// }: {
//   message: string;
//   setMessage: (value: string) => void;
// }) => {
//   const [index, setIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const prevMessage = useMemo(() => message, []);

//   useEffect(() => {
//     if (message !== prevMessage) {
//       setIndex(0);
//       setIsTyping(true);
//     }
//   }, [message, prevMessage]);

//   useEffect(() => {
//     if (isTyping && index < message.length) {
//       const timeout = setTimeout(() => setIndex((i) => i + 1), 10);
//       return () => clearTimeout(timeout);
//     } else {
//       setIsTyping(false);
//     }
//   }, [index, message, isTyping]);

//   const displayedMessage = useMemo(
//     () => message.slice(0, index),
//     [message, index],
//   );

//   return (
//     <Textarea
//       value={isTyping ? displayedMessage : message}
//       onChange={(e) => {
//         setMessage(e.target.value);
//         setIsTyping(false);
//         setIndex(e.target.value.length);
//       }}
//       className="resize-none border-black/20 bg-white h-full"
//     />
//   );
// };
