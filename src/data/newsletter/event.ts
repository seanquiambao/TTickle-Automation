import { EventType } from "@/types/event";

type QuestionType = {
  key: keyof EventType; // ✅ Ensures only valid keys are used
  title: string;
  type: "input" | "textarea";
};
export const QUESTIONS: QuestionType[] = [
  {
    title: "Name",
    key: "name",
    type: "input",
  },
  {
    title: "Date",
    key: "date",
    type: "input",
  },
  {
    title: "Location",
    key: "location",
    type: "input",
  },
  {
    title: "Description",
    key: "description",
    type: "textarea",
  },
];

export const MOCK: EventType[] = [
  {
    name: "Christmas Food Drive at LA",
    location: "Los Angeles, CA",
    description:
      "This Christmas, the spirit of giving is alive and well in Los Angeles as communities come together to organize a heartwarming food drive aimed at supporting families in need. With the holiday season often amplifying food insecurity for many, local organizations, businesses, and volunteers are joining forces to collect non-perishable food items, fresh produce, and essential supplies.",
    date: "Dec. 25, 2024",
  },
];

export const NEWSLETTER = [
  {
    title: "Giving Guide 2024",
    newsletterId: "dncg398cv93c9",
    newsletter: "From the Heart",
  },
  {
    title: "Lebron Crossing the River 2024",
    newsletterId: "bdybf9s9bdydsb",
    newsletter:
      "The sun hung low over the horizon, casting a golden glow across the Ohio River. LeBron James stood at the riverbank, his shadow stretching long and lean across the water. It was 2024, and the world had changed in ways no one could have predicted. The river, once a symbol of division, had become a test of unity, a challenge that called to the greatest of minds and athletes alike. LeBron adjusted the straps of his backpack, which held a basketball, a water bottle, and a small, weathered notebook. The notebook was filled with scribbled notes—strategies, motivational quotes, and reminders of his journey. He had faced countless challenges in his life, from the courts of the NBA to the halls of activism, but this was different. This was personal. The river was wide and treacherous, its currents unpredictable. Legends spoke of a hidden bridge, a path that only the truly determined could find. Many had tried to cross, but few had succeeded. LeBron wasn’t just crossing for himself; he was crossing for his community, for the kids who looked up to him, and for the promise of a better future. As he stepped into the water, the cold sent a shiver up his spine. He waded deeper, the current tugging at his legs. The basketball in his backpack bobbed slightly, a reminder of the game that had defined his life. But this wasn’t about basketball anymore. This was about something bigger. Halfway across, the current grew stronger. LeBron paused, catching his breath. He thought about his family, his teammates, and the countless people who had supported him over the years. He thought about the kids in Akron, the ones he had promised to inspire. He couldn’t let them down. With a deep breath, he pushed forward, his determination unwavering. The water rose to his chest, but he kept going, step by step. Suddenly, he spotted something in the distance—a series of stones, barely visible beneath the surface. They formed a path, leading to the other side. It was the hidden bridge. LeBron smiled. He had found it. With renewed energy, he followed the stones, each step bringing him closer to the shore. When he finally reached the other side, he collapsed onto the bank, exhausted but triumphant. He opened his notebook and wrote a single line: The river is only as wide as you make it in your mind. As the sun dipped below the horizon, LeBron stood up, slung his backpack over his shoulder, and looked out at the river. He knew this was just the beginning. There were more rivers to cross, more challenges to face. But for now, he had proven something to himself and to the world: no matter how wide the river, no matter how strong the current, he would always find a way to cross. And with that, LeBron James walked into the night, ready for whatever came next.",
  },
  {
    title: "Taaha's AI Bathtub 2024",
    newsletterId: "dsndsd7dssde8s",
    newsletter:
      "In the year 2024, the world had become a playground for innovation, where technology seamlessly blended with everyday life. Among the countless marvels of the era, one invention stood out as both revolutionary and whimsical: Taaha's AI Bathtub. It wasn’t just a bathtub—it was an experience, a sanctuary, and a personal assistant all rolled into one sleek, waterproof package. ",
  },
];
