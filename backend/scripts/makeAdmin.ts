import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: npm run make-admin -- <email@example.com>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(
      `No user found with email "${email}". The user must sign in with Google at least once before being promoted.`
    );
    process.exit(1);
  }

  if (user.role === "ADMIN") {
    console.log(`✅ ${email} is already an ADMIN.`);
    process.exit(0);
  }

  await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`✅ ${email} has been promoted to ADMIN.`);
  process.exit(0);
}

makeAdmin()
  .catch((err) => {
    console.error("Failed to promote user:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
