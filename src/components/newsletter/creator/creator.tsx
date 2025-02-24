"use client";

// import { useState, useMemo, useEffect } from "react";
// import { Textarea } from "@/components/ui/textarea";
import { EventType } from "@/types/event";
import Events from "./events";
import { PlateEditor } from "@/components/editor/plate-editor";

const Creator = () => {
  // const [message, setMessage] = useState("");
  // const [prompt, setPrompt] = useState("");
  // const [selectedPrompt, setSelectedPrompt] = useState("");
  // const [selectedText, setSelectedText] = useState("");
  // const [error, setError] = useState(false);
  // const [loading, setIsLoading] = useState(false);
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

  const handleEventsChange = (updatedEvents: EventType[]) => {
    console.log("Updated Events List in Parent:", updatedEvents);
    // setEvents(updatedEvents);
  };

  // if (error) {
  //   console.log("Failed");
  //   // replace with a toast
  // }

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="font-extrabold text-3xl mb-8">Newsletter</div>
      <div className="flex flex-row h-full gap-2 w-2/3 ">
        <div
          // onMouseUp={() =>
          //   setSelectedText(window.getSelection()?.toString().trim() || "")
          // }
          className="flex flex-col bg-black/5 p-4 rounded-md border border-black/20 w-full gap-4 h-full"
        >
          {/* <Textarea
            value={displayedMessage}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none border-black/20 bg-white h-full"
          /> */}
          {/* <TypingEffect message={message} setMessage={setMessage} /> */}

          <PlateEditor />
          {/* <Prompt text={prompt} />
          <div className="relative">
            <Input
              placeholder="write your prompt here"
              className="placeholder:text-black/20 placeholder:font-bold bg-white w-11/12"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              size="sm"
              variant="search"
              className="absolute top-0 right-0"
              onClick={() => generateAI(prompt, false)}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : <Search />}
            </Button>
          </div> */}
        </div>
        <Events onChange={handleEventsChange} />
      </div>
      {/* {selectedText && (
        <div className="flex flex-col bg-yellow-100 p-2 rounded-md mt-2 text-sm">
          <strong>Selected Text:</strong> {selectedText}
          <div className="flex gap-1 mt-2">
            <Input
              placeholder="Enter suggestion prompt"
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              className="w-fit"
            />
            <Button
              size="sm"
              variant="search"
              onClick={() => generateAI(selectedPrompt, true)}
              disabled={loadingSelected}
            >
              {loadingSelected ? (
                <Loader className="animate-spin" />
              ) : (
                <ArrowUpNarrowWide />
              )}
            </Button>
          </div>
        </div>
      )} */}
    </div>
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
