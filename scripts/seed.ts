import connectDB from "../lib/db";
import "@/lib/models";
import { Board, Column, ProgressApplication } from "@/lib/models";

const USER_ID = "6a99579e2ce40d6237a51b83";

const JOBS_COLUMNS = [
  {
    name: "Wish List",
    order: 0,
  },
  {
    name: "Applied",
    order: 1,
  },
  {
    name: "Interviewing",
    order: 2,
  },
  {
    name: "Offer",
    order: 3,
  },
  {
    name: "Rejected",
    order: 4,
  },
];


const SAMPLE_JOBS = [
  // Wish List
  {
    title: "MU title",
    target: "Software Developer",
    location: "San Francisco, CA",
    tags: ["React", "Tailwind", "High Pay"],
    description: "Build modern web applications using React and Tailwind CSS",
    url: "https://example.com/jobs/1",
    rate: "$120k - $150k",
  },
  {
    title: "Stripe",
    target: "Front End Developer",
    location: "Remote",
    tags: ["TypeScript", "React", "Next.js"],
    description: "Work on payment infrastructure frontend",
    url: "https://example.com/jobs/2",
    rate: "$130k - $160k",
  },
  {
    title: "Nutrishe",
    target: "QA Engineer",
    location: "New York, NY",
    tags: ["CIT", "Appium", "CI/CD"],
    description: "Ensure quality of mobile and web applications",
    url: "https://example.com/jobs/3",
    rate: "$90k - $110k",
  },
  // Applied
  {
    title: "LeaFood",
    target: "DevOps Engineer",
    location: "Austin, TX",
    tags: ["promQL", "Full-stack", "Docker"],
    description: "Manage infrastructure and deployment pipelines",
    url: "https://example.com/jobs/4",
    rate: "$110k - $140k",
  },
  {
    title: "Nomura",
    target: "Mobile Developer",
    location: "Tokyo, Japan",
    tags: ["React Native", "iOS", "Android"],
    description: "Develop mobile applications for financial services",
    url: "https://example.com/jobs/5",
    rate: "$100k - $130k",
  },
  {
    title: "Wise",
    target: "UI/UX Designer",
    location: "London, UK",
    tags: ["Figma", "Design Systems", "User Research"],
    description: "Design beautiful and intuitive user experiences",
    url: "https://example.com/jobs/6",
    rate: "$80k - $100k",
  },
  {
    title: "Danone",
    target: "DevOps Engineer",
    location: "Paris, France",
    tags: ["promQL", "Full-stack", "Docker"],
    description: "Support cloud infrastructure and CI/CD",
    url: "https://example.com/jobs/7",
    rate: "$95k - $120k",
  },
  // Interviewing
  {
    title: "Retomotion",
    target: "Web Designer",
    location: "Berlin, Germany",
    tags: ["Figma", "React", "Bootstrap"],
    description: "Create responsive web designs and implement them",
    url: "https://example.com/jobs/8",
    rate: "$85k - $105k",
  },
  {
    title: "WorkLab",
    target: "Product Manager",
    location: "Seattle, WA",
    tags: ["Product Strategy", "Agile", "Analytics"],
    description:
      "Help drive the product and business planning for our platform",
    url: "https://example.com/jobs/9",
    rate: "$140k - $170k",
  },
  {
    title: "I Networks",
    target: "Mobile Developer",
    location: "Remote",
    tags: ["Flutter", "Dart", "Firebase"],
    description: "Build cross-platform mobile applications",
    url: "https://example.com/jobs/10",
    rate: "$115k - $145k",
  },
  // Offer
  {
    title: "Profan",
    target: "Software Developer",
    location: "Stockholm, Sweden",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    description: "Develop backend services and APIs",
    url: "https://example.com/jobs/11",
    rate: "$100k - $125k",
  },
  {
    title: "MUS Logistics",
    target: "UI Designer",
    location: "Amsterdam, Netherlands",
    tags: ["Figma", "Illustrator"],
    description:
      "Lead the UX process and workflow, and work closely with development team",
    url: "https://example.com/jobs/12",
    rate: "$90k - $110k",
  },
  // Rejected
  {
    title: "Ultra Vouche",
    target: "Associate",
    location: "Chicago, IL",
    tags: ["Scrum", "Agile"],
    description: "Support product development and project management",
    url: "https://example.com/jobs/13",
    rate: "$70k - $85k",
  },
  {
    title: "NRI",
    target: "Web Test",
    location: "Boston, MA",
    tags: ["Testing", "Automation"],
    description: "Manage product testing and quality assurance",
    url: "https://example.com/jobs/14",
    rate: "$75k - $90k",
  },
  {
    title: "TOG London",
    target: "Data Ana",
    location: "London, UK",
    tags: ["JavaScript", "Python", "SQL"],
    description: "Analyze user data and provide insights for product decisions",
    url: "https://example.com/jobs/15",
    rate: "$85k - $100k",
  },
];

async function seed() {
  if (!USER_ID) {
    console.error("❌ Error: SEED_USER_ID environment variable is required");
    console.log("Usage: SEED_USER_ID=your-user-id npm run seed");
    process.exit(1);
  }

  try {
    console.log("🌱 Starting seed process...");
    console.log(`📋 Seeding data for user ID: ${USER_ID}`);

    await connectDB();
    console.log("✅ Connected to database");

    // Find the user's board
    let board = await Board.findOne({ userId: USER_ID, name: "Job Hunt" });

    if (!board) {
      console.log("⚠️  Board not found. Creating board...");
      const { initializeUserBoard } = await import("../lib/init-user-board");
      board = await initializeUserBoard(USER_ID, "Job Hunt", JOBS_COLUMNS);
      console.log("✅ Board created");
    } else {
      console.log("✅ Board found");
    }

    // Get all columns
    const columns = await Column.find({ boardId: board._id }).sort({
      order: 1,
    });
    console.log(`✅ Found ${columns.length} columns`);

    if (columns.length === 0) {
      console.error(
        "❌ No columns found. Please ensure the board has default columns."
      );
      process.exit(1);
    }

    // Map column names to column IDs
    const columnMap: Record<string, string> = {};
    columns.forEach((col) => {
      columnMap[col.name] = col._id.toString();
    });

    // Clear existing job applications for this user
    const existingJobs = await ProgressApplication.find({ userId: USER_ID });
    if (existingJobs.length > 0) {
      console.log(
        `🗑️  Deleting ${existingJobs.length} existing job applications...`
      );
      await ProgressApplication.deleteMany({ userId: USER_ID });

      // Clear job applications from columns
      for (const column of columns) {
        column.jobApplications = [];
        await column.save();
      }
    }

    // Distribute jobs across columns
    const jobsByColumn: Record<string, typeof SAMPLE_JOBS> = {
      "Wish List": SAMPLE_JOBS.slice(0, 3),
      Applied: SAMPLE_JOBS.slice(3, 7),
      Interviewing: SAMPLE_JOBS.slice(7, 10),
      Offer: SAMPLE_JOBS.slice(10, 12),
      Rejected: SAMPLE_JOBS.slice(12, 15),
    };

    let totalCreated = 0;

    for (const [columnName, jobs] of Object.entries(jobsByColumn)) {
      const columnId = columnMap[columnName];
      if (!columnId) {
        console.warn(`⚠️  Column "${columnName}" not found, skipping...`);
        continue;
      }

      const column = columns.find((c) => c.name === columnName);
      if (!column) continue;

      for (let i = 0; i < jobs.length; i++) {
        const jobData = jobs[i];
        const jobApplication = await ProgressApplication.create({
          title: jobData.title,
          target: jobData.target,
          location: jobData.location,
          tags: jobData.tags,
          description: jobData.description,
          url: jobData.url,
          rate: jobData.rate,
          columnId: columnId,
          boardId: board._id,
          userId: USER_ID,
          status: columnName.toLowerCase().replace(" ", "-"),
          order: i,
        });

        column.progressApplication.push(jobApplication._id);
        totalCreated++;
      }

      await column.save();
      console.log(`✅ Added ${jobs.length} jobs to "${columnName}" column`);
    }

    console.log(`\n🎉 Seed completed successfully!`);
    console.log(`📊 Created ${totalCreated} job applications`);
    console.log(`📋 Board: ${board.name}`);
    console.log(`👤 User ID: ${USER_ID}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();