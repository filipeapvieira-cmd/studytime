const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prismaClient = new PrismaClient();

async function main() {
  // Define users data
  const users = [
    {
      name: "Alice",
      email: "alice@example.com",
      emailVerified: new Date(),
      isTwoFactorEnabled: false,
      password: "password123", // Plain text password
    },
    {
      name: "Bob",
      email: "bob@example.com",
      emailVerified: new Date(),
      isTwoFactorEnabled: false,
      password: "password456", // Plain text password
    },
  ];

  // Loop through each user and create them along with study sessions
  for (const userData of users) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await prismaClient.user.create({
      data: {
        ...userData,
        password: hashedPassword, // Use the hashed password
        StudySession: {
          create: Array.from({ length: 10 }, (_, index) => {
            const startTime = new Date();
            startTime.setDate(startTime.getDate() - index); // Each session is on a consecutive past day
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1); // End time is 1 hour after start time

            const sessionDuration = 60 * 60 * 1000; // Session duration in milliseconds (1 hour)

            // Distribute timeOfStudy among topics within the session duration
            const topicTimes = [
              sessionDuration * 0.4, // 40% of session duration
              sessionDuration * 0.3, // 30% of session duration
              sessionDuration * 0.3, // 30% of session duration
            ];

            return {
              startTime,
              endTime,
              pauseDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
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
