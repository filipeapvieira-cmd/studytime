const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prismaClient = new PrismaClient();
const realisticTopics = [
  {
    title: "Academic Work",
    typicalMinutes: 60, // from ~45m to ~90m
    possibleHashtags: ["LearningOutcome", "Research", "Reflection"],
  },
  {
    title: "Project",
    typicalMinutes: 75, // from ~30m to ~120m
    possibleHashtags: ["AI", "Project"],
  },
  {
    title: "Learning",
    typicalMinutes: 60,
    possibleHashtags: ["YouTube"],
  },
  {
    title: "WorkRelated",
    typicalMinutes: 90,
    possibleHashtags: [],
  },
  {
    title: "Next.js",
    typicalMinutes: 45,
    possibleHashtags: ["YouTube"],
  },
  {
    title: "Miscellaneous",
    typicalMinutes: 40,
    possibleHashtags: [],
  },
  {
    title: "Reflection",
    typicalMinutes: 30,
    possibleHashtags: ["Reflection"],
  },
  {
    title: "Research",
    typicalMinutes: 60,
    possibleHashtags: ["Research"],
  },
];

/**
 * Some possible "feelings" or notes, patterned on your logs.
 */
const possibleFeelings = [
  "Feeling Productive",
  "Feeling Tired",
  "Feeling Distracted",
  "Feeling Motivated",
];

// Define users data — now we have 5 users
const users = [
  {
    name: "Alice",
    email: "alice@example.com",
    emailVerified: new Date(),
    isTwoFactorEnabled: false,
    password: "1234", // Plain text password
  },
  {
    name: "Bob",
    email: "bob@example.com",
    emailVerified: new Date(),
    isTwoFactorEnabled: false,
    password: "1234",
  },
  {
    name: "Charlie",
    email: "charlie@example.com",
    emailVerified: new Date(),
    isTwoFactorEnabled: false,
    password: "1234",
  },
  {
    name: "David",
    email: "david@example.com",
    emailVerified: new Date(),
    isTwoFactorEnabled: false,
    password: "1234",
  },
  {
    name: "Eve",
    email: "eve@example.com",
    emailVerified: new Date(),
    isTwoFactorEnabled: false,
    password: "1234",
  },
];

/**
 * We’ll keep the date range to your timeframe:
 *   Start: 2024-09-03
 *   End:   2024-11-27
 *
 * The function below chooses a random DateTime in that range,
 * often in the evening (19:00 - 22:00) on weekdays, with a higher chance
 * for a morning or extended session on weekends.
 */
function getRandomSessionDateTime(): { start: Date; end: Date } {
  // Hardcode earliest and latest allowed timestamps
  const startRange = new Date("2024-09-03T00:00:00");
  const endRange = new Date("2025-02-21T23:59:59");

  // Pick a random date within the range
  const randomTime =
    startRange.getTime() +
    Math.random() * (endRange.getTime() - startRange.getTime());

  const randomDate = new Date(randomTime);

  // Let’s shape the time-of-day to reflect:
  //  - ~70% chance of evening sessions (19:00 - 22:00) on weekdays
  //  - ~30% chance of morning or midday sessions especially on Sat/Sun
  const dayOfWeek = randomDate.getDay(); // 0=Sun, 6=Sat
  let sessionStartHour = 19; // default 19:00
  let sessionDurationMinutes = 60; // default 60 min

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend) {
    // On weekends, random start between 8am - 20pm
    sessionStartHour = 8 + Math.floor(Math.random() * 12); // 8..19
    // Possibly longer sessions on weekend
    sessionDurationMinutes = 60 + Math.floor(Math.random() * 60);
  } else {
    // Weekday logic
    if (Math.random() < 0.3) {
      // 30% chance it’s an earlier session (like 7am, or midday)
      sessionStartHour = 7 + Math.floor(Math.random() * 7); // 7..13
      sessionDurationMinutes = 45 + Math.floor(Math.random() * 30);
    } else {
      // 70% chance typical evening session
      sessionStartHour = 19 + Math.floor(Math.random() * 3); // 19..21
      sessionDurationMinutes = 50 + Math.floor(Math.random() * 45);
    }
  }

  // Construct start date
  const startDate = new Date(
    randomDate.getFullYear(),
    randomDate.getMonth(),
    randomDate.getDate(),
    sessionStartHour,
    Math.floor(Math.random() * 60), // random minute
    0,
    0
  );

  // End date is start date + random sessionDuration
  const endDate = new Date(
    startDate.getTime() + sessionDurationMinutes * 60_000
  );

  // Ensure we do not exceed the upper boundary
  if (endDate > endRange) {
    return { start: startRange, end: startRange }; // fallback
  }

  return { start: startDate, end: endDate };
}

/**
 * Creates a random “topics” array for the session,
 * up to 2 or 3 random picks from realisticTopics, distributing times by ratio.
 */
function getRandomTopics(sessionDurationMs: number) {
  const howManyTopics = 1 + Math.floor(Math.random() * 3); // 1..3
  const chosenTopics: {
    title: string;
    description: string;
    timeOfStudy: number;
  }[] = [];

  // Shuffle a copy of realisticTopics
  const topicsCopy = [...realisticTopics].sort(() => Math.random() - 0.5);
  const picks = topicsCopy.slice(0, howManyTopics);

  // If we have multiple topics in one session, we’ll randomly distribute the total session time
  // among them by ratio
  // create random ratio for each
  const ratios = Array(howManyTopics)
    .fill(0)
    .map(() => Math.random());

  const sumRatios = ratios.reduce((acc, r) => acc + r, 0);

  picks.forEach((topic, i) => {
    const fraction = ratios[i] / sumRatios;
    const allocatedMs = fraction * sessionDurationMs;
    chosenTopics.push({
      title: topic.title,
      description: `${topic.title} session`,
      timeOfStudy: Math.floor(allocatedMs), // integer
    });
  });

  return chosenTopics;
}

/**
 * Returns a random feeling sometimes (e.g., 50% chance).
 */
function getRandomFeeling(index: number) {
  if (Math.random() < 0.5) {
    const msg =
      possibleFeelings[Math.floor(Math.random() * possibleFeelings.length)];
    return { description: `Session #${index + 1} - ${msg}` };
  }
  return null;
}

async function main() {
  // Step 1: create or define your users
  const users = [
    {
      name: "Alice",
      email: "alice@example.com",
      password: "1234", // will be hashed
      isTwoFactorEnabled: false,
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: "1234",
      isTwoFactorEnabled: false,
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      password: "1234",
      isTwoFactorEnabled: false,
    },
    // Add as many users as you want...
  ];

  // Step 2: For each user, generate a random number of sessions
  // to reflect that not everyone has exactly 10 sessions.
  for (const [uIndex, userData] of users.entries()) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        emailVerified: new Date(),
        isTwoFactorEnabled: userData.isTwoFactorEnabled,
        password: hashedPassword,
      },
    });

    // Each user gets between 8 and 15 sessions
    const sessionCount = 8 + Math.floor(Math.random() * 8); // 8..15

    const sessionData = [];

    for (let i = 0; i < sessionCount; i++) {
      const { start, end } = getRandomSessionDateTime();
      const sessionDuration = end.getTime() - start.getTime();

      // Pause is sometimes zero, sometimes ~5-10 minutes
      const pauseDurationMs = Math.random() < 0.3 ? 0 : 5 * 60_000;

      const topics = getRandomTopics(sessionDuration - pauseDurationMs);

      const maybeFeeling = getRandomFeeling(i);

      sessionData.push({
        startTime: start,
        endTime: end,
        pauseDuration: pauseDurationMs,
        topic: {
          create: topics,
        },
        feeling: maybeFeeling
          ? {
              create: maybeFeeling,
            }
          : undefined,
      });
    }

    // Bulk-create sessions for this user
    await prismaClient.studySession.createMany({
      data: sessionData.map((s) => ({
        userId: newUser.id,
        startTime: s.startTime,
        endTime: s.endTime,
        pauseDuration: s.pauseDuration,
      })),
    });

    // Because we have related records (topic, feeling), we need a small trick:
    // we created the `studySession` records directly with createMany(...), but
    // the “topic” and “feeling” belong in a separate create.
    //
    // Alternatively, we could do a loop with `create({ data: { ... } })`
    // and nest the creation. But using createMany is convenient for performance.
    // So let’s fetch the newly created sessions and connect them to the topics/feelings:
    const createdSessions = await prismaClient.studySession.findMany({
      where: { userId: newUser.id },
      orderBy: { startTime: "asc" },
    });

    for (let i = 0; i < createdSessions.length; i++) {
      const s = createdSessions[i];
      const original = sessionData[i];

      // if this session had topics
      if (original.topic?.create && original.topic.create.length) {
        // create each topic referencing the studySession
        for (const t of original.topic.create) {
          await prismaClient.topic.create({
            data: {
              title: t.title,
              description: t.description,
              timeOfStudy: t.timeOfStudy,
              studySession: {
                connect: { id: s.id },
              },
            },
          });
        }
      }

      // if this session had a feeling
      if (original.feeling?.create) {
        await prismaClient.feeling.create({
          data: {
            description: original.feeling.create.description,
            studySession: {
              connect: { id: s.id },
            },
          },
        });
      }
    }
  }

  console.log("✅ Seeding complete with more realistic sessions!");
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
