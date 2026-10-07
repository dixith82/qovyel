// Seeds only content that actually exists and is verified — the real
// project list with real URLs (matching frontend/src/data/projects.js
// exactly), the real five services shown in the approved UI, and the
// existing demo testimonials (still marked isDemo: true, matching the
// "Demo Testimonial" badge already in the frontend). No fabricated
// clients, inquiries, or statistics are created here.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    title: "Avengers: Doomsday",
    category: "Cinematic Web Experience",
    description:
      "A cinematic scroll-driven web experience with immersive storytelling, character sections and cinematic transitions.",
    url: "https://avengers-doomsday-pearl.vercel.app",
    order: 1,
  },
  {
    title: "Alien Galaxy Explorer",
    category: "Interactive Web Experience",
    description: "",
    url: "https://alien-galaxy-explorer.vercel.app",
    order: 2,
  },
  {
    title: "Anandobrahma",
    category: "Restaurant / Fine Dining Website",
    description:
      "Premium fine-dining website with menu, gallery, guest stories, reservations and restaurant information.",
    url: "https://golden-ambrosia-project.lovable.app",
    order: 3,
  },
  {
    title: "Webhead Archives",
    category: "Interactive Entertainment Website",
    description: "",
    url: "https://webhead-archives.lovable.app",
    order: 4,
  },
  {
    title: "Shopify Sparkle",
    category: "E-Commerce Website",
    description: "",
    url: "https://shopify-sparkle-68.lovable.app",
    order: 5,
  },
];

// Matches the 5 cards actually shown in the approved frontend UI. QOVYEL's
// business list also mentions "Custom Digital Products", but that isn't
// one of the 5 cards in the approved design — see README for how to add
// it if/when the frontend is updated to show a 6th card.
const services = [
  { title: "Web Development", description: "Modern, responsive and high-performing websites.", order: 1 },
  { title: "App Development", description: "Web and mobile applications built for real-world use.", order: 2 },
  { title: "AI Solutions", description: "Custom AI tools to automate and solve problems.", order: 3 },
  { title: "Data & Dashboards", description: "Turn data into meaningful insights.", order: 4 },
  { title: "UI/UX Design", description: "Clean, modern interfaces designed around users.", order: 5 },
];

// Identical to frontend/src/data/testimonials.js. isDemo: true is
// intentional and load-bearing — see prisma/schema.prisma.
const testimonials = [
  {
    name: "Client Name",
    role: "Founder",
    company: "Company Name",
    testimonial:
      "QOVYEL took our idea and turned it into a product that actually feels premium. The process was smooth from the first call to launch.",
    isDemo: true,
    order: 1,
  },
  {
    name: "Client Name",
    role: "Product Lead",
    company: "Company Name",
    testimonial:
      "What stood out was the attention to detail. Every screen, every interaction felt intentional. Exactly the kind of partner we needed.",
    isDemo: true,
    order: 2,
  },
  {
    name: "Client Name",
    role: "CEO",
    company: "Company Name",
    testimonial:
      "They didn't just build what we asked for — they challenged our assumptions and made the end result far stronger.",
    isDemo: true,
    order: 3,
  },
];

async function main() {
  console.log("Seeding projects...");
  for (const project of projects) {
    const exists = await prisma.project.findFirst({ where: { title: project.title } });
    if (!exists) await prisma.project.create({ data: project });
  }

  console.log("Seeding services...");
  for (const service of services) {
    const exists = await prisma.service.findFirst({ where: { title: service.title } });
    if (!exists) await prisma.service.create({ data: service });
  }

  console.log("Seeding demo testimonials...");
  for (const testimonial of testimonials) {
    const exists = await prisma.testimonial.findFirst({
      where: { name: testimonial.name, order: testimonial.order },
    });
    if (!exists) await prisma.testimonial.create({ data: testimonial });
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
