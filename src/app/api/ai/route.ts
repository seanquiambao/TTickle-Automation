import { db } from "@/utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_AI_KEY || "",
});

export const POST = async (req: NextRequest) => {
  //   const res = NextResponse;

  const body = await req.json();
  console.log(body);

  try {
    // const response = "Hello BRO"
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an editor and you are tasked to compile all these events into a newsletter in order to inform the user in an automated email.",
        },
        { role: "user", content: JSON.stringify(body) },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    const AIresponse = response.choices?.[0]?.message?.content || "No response";
    console.log("AI Response:", AIresponse);
    // for await (const chunk of response) {
    //     // use process.stdout.write instead of console.log to avoid newlines
    //     process.stdout.write(chunk.choices[0]?.delta?.content || '');
    //   }
    // user: userid need to link it to the respective user
    await addDoc(collection(db, "responses"), {
      response: AIresponse,
      timestamp: new Date(),
    });
    return NextResponse.json({ items: AIresponse }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
