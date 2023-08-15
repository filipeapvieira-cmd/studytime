import path from "path";
import { promises as fs } from "fs";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { PrismaClient, Prisma } from "@prisma/client";
import { adaptTimeZone } from "@/lib/session-log/utils";
/*
type ImportedSessionData = {
  id: number;
  session_content: string;
  session_date: string;
  stop_time: string;
  session_feelings: string;
  pause_time: string;
  resume_time: string;
  session_number: number;
  start_time: string;
  paused_time: string;
  total_time: string;
};

export const parseJSON = async () => {
  const jsonDirectory = path.join(process.cwd(), "docs");
  const fileContents = await fs.readFile(
    jsonDirectory + "/studysessions.json",
    "utf8"
  );
  return JSON.parse(fileContents);
};

const convertStringToDate = (date: string, time: string) => {
  const dateString = `${date} ${time}`;
  const dateObj = new Date(dateString);
  return adaptTimeZone(dateObj.getTime());
};

const convertStringToMilliseconds = (pausedTime: string) => {
  const time = pausedTime;
  const parts = time.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
};

const userId = 1;

const convertToPrismaFormat = (
  data: [ImportedSessionData]
): Prisma.StudySessionCreateInput[] => {
  return data.map((item) => {
    return {
      startTime: convertStringToDate(item.session_date, item.start_time),
      endTime: convertStringToDate(item.session_date, item.stop_time),
      pauseDuration: convertStringToMilliseconds(item.paused_time),
      user: {
        connect: {
          id: userId,
        },
      },
      content: {
        create: {
          topic: "MigrationTopic",
          timeOfStudy: convertStringToMilliseconds(item.total_time),
          contentDescription: item.session_content,
        },
      },
      feeling: {
        create: {
          feelingDescription: item.session_feelings,
        },
      },
    };
  });
};

export const migrateSessionData = async () => {
  let counter = 0;
  const rawData = await parseJSON();
  const convertedData = convertToPrismaFormat(rawData);

  console.log("Start Migration....");
  convertedData.forEach(async (item, index) => {
    counter++;
    try {
      //await db.studySession.create({ data: item });
    } catch (error) {
      console.error(error);
    } finally {
      await db.$disconnect();
      console.log(`Item ${index} was migrated!`);
    }
  });
  console.log(`Ended Migration. A total of ${counter} records were migrated`);
};
*/
