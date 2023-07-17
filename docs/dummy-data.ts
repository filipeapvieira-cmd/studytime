import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { PrismaClient, Prisma } from "@prisma/client";

/* Users */
const createData = async () => {
  const users = [
    {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: "password",
    },
    {
      name: "Michael Johnson",
      email: "michaeljohnson@example.com",
      password: "password",
    },
    {
      name: "Emily Brown",
      email: "emilybrown@example.com",
      password: "password",
    },
    {
      name: "Daniel Wilson",
      email: "danielwilson@example.com",
      password: "password",
    },
    {
      name: "Olivia Davis",
      email: "oliviadavis@example.com",
      password: "password",
    },
  ];

  for (const user of users) {
    await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: await hash(user.password, 10),
      },
    });
  }
};
createData();

/* Sessions */
async function createDummyData() {
  function randomDate() {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  // Generate a random pause duration between 0 and 60 minutes
  function randomPauseDuration() {
    return Math.floor(Math.random() * 60);
  }

  // Generate a random topic
  function randomTopic() {
    const topics = [
      "Web Development",
      "Mobile App Development",
      "Database Management",
      "Software Testing",
      "Version Control Systems",
    ];

    const subtopics = ["HTML/CSS", "JavaScript", "React"];

    const content = [
      "Web Development:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tristique urna ac fermentum. Aenean feugiat auctor lacus, in ultrices neque fermentum ac. Cras sed volutpat nulla.\n",
      "Mobile App Development:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tristique urna ac fermentum. Aenean feugiat auctor lacus, in ultrices neque fermentum ac. Cras sed volutpat nulla.\n",
      "Database Management:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tristique urna ac fermentum. Aenean feugiat auctor lacus, in ultrices neque fermentum ac. Cras sed volutpat nulla.\n",
      "Software Testing:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tristique urna ac fermentum. Aenean feugiat auctor lacus, in ultrices neque fermentum ac. Cras sed volutpat nulla.\n",
      "Version Control Systems:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod tristique urna ac fermentum. Aenean feugiat auctor lacus, in ultrices neque fermentum ac. Cras sed volutpat nulla.\n",
    ];
    return {
      topic: topics[Math.floor(Math.random() * topics.length)],
      subtopic: subtopics[Math.floor(Math.random() * subtopics.length)],
      contentDescription: content[Math.floor(Math.random() * content.length)],
    };
  }

  // Generate a random feeling description
  function randomFeelingDescription() {
    const feelings = [
      "Feeling: Happy\n",
      "Feeling: Sad\n",
      "Feeling: Neutral\n",
      "Feeling: Excited\n",
      "Feeling: Bored\n",
    ];
    return feelings[Math.floor(Math.random() * feelings.length)];
  }

  // Generate random user id
  function randomUserId() {
    const validIds = [12, 13, 14, 15, 16, 17, 18, 19];
    return validIds[Math.floor(Math.random() * validIds.length)];
  }

  // Create 30 records
  for (let i = 0; i < 30; i++) {
    const timeAndDate = {
      startTime: randomDate(),
      endTime: randomDate(),
      pausedTime: randomPauseDuration(),
    };

    const description = {
      topics: [randomTopic()],
      feelings: randomFeelingDescription(),
    };

    const userId = randomUserId();

    const sessionData: Prisma.StudySessionCreateInput = {
      startTime: timeAndDate.startTime,
      endTime: timeAndDate.endTime,
      user: {
        connect: {
          id: 12,
        },
      },
      pauseDuration: timeAndDate.pausedTime,
      content: {
        create: description.topics.map((topic) => ({
          topic: topic.topic,
          subtopic: topic.subtopic,
          contentDescription: topic.contentDescription,
        })),
      },
      feeling: {
        create: {
          feelingDescription: description.feelings,
        },
      },
    };

    await db.studySession.create({ data: sessionData });
  }
}
createDummyData();
createDummyData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
