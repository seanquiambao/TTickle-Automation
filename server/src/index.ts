import dotenv from "dotenv";
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  json,
} from "express";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { RedisClientType } from "redis";
import { sendEmail } from "./util/email";
import { db } from "./util/firebase";
import RedisConnector from "./util/redis.connector";

dotenv.config({
  path: "../.env",
});
const app: Express = express();
app.use(json());

app.get("/me", (req, res) => {
  const u = (req as any).user as any;
  res.json({
    uid: u.uid,
    email: u.email,
    name: u.name,
    picture: u.picture,
    siteRole: u.siteRole ?? "user",
    orgId: u.orgId ?? null,
    orgRole: u.orgRole ?? null,
  });
});

const port = 3001;

const redisConnector = new RedisConnector(process.env.REDIS_URL ?? "");

type Email = {
  id: string;
  epochSchedule: string;
  template: string;
};

const getOrg = async (uuid: string) => {
  const result = await getDocs(
    query(collection(db, "orgs"), where("id", "==", uuid), limit(1)),
  );
  if (result.empty) return undefined;
  return result.docs[0].data();
};

app.put(
  "/api/scheduler",
  express.json(),
  async (req: Request, res: Response) => {
    try {
      const { id, epochSchedule } = req.body as Email;

      const date = new Date(epochSchedule);
      const now = new Date();
      // console.log(date.toLocaleString(), now.toLocaleString())
      const document = await getDoc(doc(collection(db, "newsletters"), id));
      const data = document.data();
      // console.log(data)
      if (!data) return;
      const organizationDoc = await getOrg(data.orgId);
      // console.log(organizationDoc)
      const seconds = (date.getTime() - now.getTime()) / 1000;
      // console.log(data)
      // console.log(seconds)
      if (date > now) {
        await put(id, seconds);
      } else {
        onKeyExpired(id);
      }
      // await put(uuid, 2);
      res.status(200).send("hi");
    } catch (e) {
      console.log(req.body, e);
      res.status(400).send("No work");
    }
  },
);

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  // const q = query(collection(db, "newsletters"));
  // const querySnapshot = await getDocs(q);
  // const newsletters = querySnapshot.docs.map((doc) => {
  //   const data = doc.data();
  //   return {
  //     newsletter: data.newsletter,
  //     newsletterId: data.newsletterId,
  //     status: data.status,
  //     scheduledDate: data.scheduledDate ?? 0,
  //   };
  // });
  // console.log(
  //   newsletters
  //     .filter((nl) => nl.scheduledDate != 0)
  //     .map((nl) => {
  //       nl.scheduledDate = new Date(nl.scheduledDate);
  //       return nl;
  //     }),
  // );
  await redisConnector.connect();
  const client = redisConnector.client;
  const subscriber: RedisClientType = redisConnector.duplicate();

  client.on("error", (err) => console.error("Redis Client Error:", err));
  subscriber.on("error", (err) =>
    console.error("Redis Subscriber Error:", err),
  );
  await subscriber.connect();

  // Enable keyspace notifications for expired events (for DB 0)
  await client.configSet("notify-keyspace-events", "Ex");

  // Subscribe to the expiration channel for database 0
  await subscriber.subscribe(
    "__keyevent@0__:expired",
    async (expiredKey: string) => {
      // console.log(`Key expired: ${expiredKey}`);
      await onKeyExpired(expiredKey);
    },
  );

  const newsletters = await getDocs(collection(db, "newsletters"));
  const now = new Date();
  for (const doc of newsletters.docs) {
    const data = doc.data();
    if (
      (data.status ?? "") === "scheduled" &&
      new Date(data.scheduledDate ?? Date.now()) <= now
    ) {
      onKeyExpired(doc.id);
    }
  }

  await redisConnector.disconnect();
});

// process.on("exit", async () => {
//   console.log("EXIT: Disconnecting all open redis connections!");
//   await shutdown();
// });
// process.on("SIGINT", async () => {
//   console.log("SIGINT: Disconnecting all open redis connections!");
//   await shutdown();
// });

const shutdown = async () => {
  if (redisConnector.client.isOpen) {
    await redisConnector.disconnect();
  }
  for (const dupe of redisConnector.duplicates.filter((dupe) => dupe.isOpen)) {
    dupe.disconnect();
  }
};

const put = async (key: string, scheduled: number) => {
  if (!redisConnector.client.isOpen) {
    await redisConnector.connect();
  }
  const client = redisConnector.client;
  await client.set(key, "", { EX: Math.floor(scheduled) });
  await redisConnector.disconnect();
};

const parseParagraph = (obj: any, content: any[]) => {
  let result = "";
  if (obj.content && obj.content.length > 0) {
    let rawLine = "";
    for (const line of obj.content ?? []) {
      const finishingTags: string[] = []; // queue
      if ("marks" in line) {
        const marks = line.marks.map((item: { type: string }) => item.type);
        marks.forEach((mark: string) => {
          if (mark === "bold") {
            rawLine += "<b>";
            finishingTags.push("</b>");
          } else if (mark === "italic") {
            rawLine += "<i>";
            finishingTags.push("</i>");
          }
        });
      }
      rawLine += line.text.replace("\n", "<br />");
      while (finishingTags.length > 0) {
        rawLine += finishingTags.pop();
      }
      // if (content.indexOf(obj) < content.length - 1) {
      //   result += "<br />"
      // }
    }
    result += `<p style="color: black !important; margin: 0;">${rawLine}</p>`;
  } else {
    result += "<br />";
  }
  return result;
};

const onKeyExpired = async (expiredKey: string) => {
  // This function will be triggered when a key expires
  // console.log(`Handling expired key: ${expiredKey}`);
  // Place your custom logic here (e.g., sending an HTTP request or updating your app state)
  const document = await getDoc(doc(collection(db, "newsletters"), expiredKey));
  const data = document.data();
  if (!data) return;
  const organizationDoc = await getOrg(data.orgId);

  const newsletterBody = data.newsletter;
  let body = "Body here";
  if (newsletterBody instanceof Array) {
    // old format
    body = newsletterBody.join("<br />");
  } else {
    // new format
    const content = newsletterBody.content ?? [];
    let stringBody = "";
    for (const obj of content) {
      if (obj.type === "paragraph") {
        stringBody += parseParagraph(obj, content);
      } else if (obj.type === "bulletList") {
        for (const bullet of obj.content ?? []) {
          const bulletContent = bullet.content[0];
          if (bulletContent.type === "paragraph") {
            const body = parseParagraph(bulletContent, obj.content);
            stringBody += `<ul>${body
              .replace("<br />", "")
              .split("\n")
              .map((text) => `<li>${text}</li>`)}</ul>`;
          }
        }
      }
    }
    body = stringBody === "" ? body : stringBody;
  }

  const template = data.template ?? "vibrant";
  const recipients =
    organizationDoc?.groups.filter(
      (group: any) => group.name === data?.recipientGroup,
    )[0]?.emails ?? [];
  if (recipients.length > 0) {
    await sendEmail(
      data?.subject ?? "Subject here",
      `<p style="color: black !important; margin: 0;">${body}</p>`,
      recipients,
      template,
    ).then(async (res) => {
      await updateDoc(doc(collection(db, "newsletters"), expiredKey), {
        status: "sent",
      });
    });
  }
};
