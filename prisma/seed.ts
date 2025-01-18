const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prismaClient = new PrismaClient();

async function main() {
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

  // For demonstration, let's create 10 sessions per user,
  // with session dates spread across multiple years:
  // - We’ll “shift” the start year for each session index:
  //   0..3 => 2023, 4..7 => 2024, 8..9 => 2025, for example.
  //   Or customize to your preference.

  for (const userData of users) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await prismaClient.user.create({
      data: {
        ...userData,
        password: hashedPassword, // use the hashed password
        StudySession: {
          create: Array.from({ length: 10 }, (_, index) => {
            // Decide which year to use based on index (just an example pattern)
            let year;
            if (index < 4) {
              year = 2023;
            } else if (index < 8) {
              year = 2024;
            } else {
              year = 2025;
            }

            // Arbitrary month logic: spread them out
            // For example, let the month be index * 2 (mod 12)
            const month = (index * 2) % 12;
            // Start time at 9:00 AM
            const startTime = new Date(year, month, 1, 9, 0, 0);
            // End time is 1 hour after start time
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);

            // One hour in milliseconds
            const sessionDuration = 60 * 60 * 1000;

            // Distribute timeOfStudy among 3 topics
            const topicTimes = [
              sessionDuration * 0.4, // 40% of session
              sessionDuration * 0.3, // 30%
              sessionDuration * 0.3, // 30%
            ];

            return {
              startTime,
              endTime,
              // 5 minutes in milliseconds
              pauseDuration: 5 * 60 * 1000,
              topic: {
                create: [
                  {
                    title: `Topic ${index + 1} - Mathematics`,
                    description: `Mathematics session ${index + 1}`,
                    timeOfStudy: topicTimes[0],
                  },
                  {
                    title: `Topic ${index + 1} - Physics`,
                    description: `Physics session ${index + 1}`,
                    timeOfStudy: topicTimes[1],
                  },
                  {
                    title: `Topic ${index + 1} - Programming`,
                    description: `Programming session ${index + 1}`,
                    timeOfStudy: topicTimes[2],
                  },
                ],
              },
              feeling: {
                create: {
                  description: `Feeling ${index + 1} - Productive`,
                },
              },
            };
          }),
        },
      },
    });
  }
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
