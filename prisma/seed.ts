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
          create: Array.from({ length: 5 }, (_, index) => {
            // Adjusting dates for valid Date objects
            const startTime = new Date();
            startTime.setDate(startTime.getDate() - index); // Each session is on a consecutive past day
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1); // End time is 1 hour after start time

            return {
              startTime,
              endTime,
              pauseDuration: 5,
              topic: {
                create: [
                  {
                    title: `Topic ${index + 1}`,
                    description: `Description for topic ${index + 1}`,
                    timeOfStudy: 60,
                  },
                ],
              },
              feeling: {
                create: {
                  description: `Feeling ${index + 1}`,
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
