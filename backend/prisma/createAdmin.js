// Creates (or updates the password for) an admin user. Credentials are
// never hardcoded — they're read from CLI arguments so nothing sensitive
// lives in source control. Usage:
//
//   node prisma/createAdmin.js you@qovyel.com "a-strong-password"
//
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [, , email, password, name] = process.argv;

  if (!email || !password) {
    console.error('Usage: node prisma/createAdmin.js "you@qovyel.com" "a-strong-password" ["Display Name"]');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name: name || undefined },
    create: { email: email.toLowerCase(), passwordHash, name: name || null },
  });

  console.log(`Admin user ready: ${admin.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
