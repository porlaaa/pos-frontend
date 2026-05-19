require("dotenv").config();
const mongoose = require("mongoose");
const Table = require("./models/tableModel");

const seedTables = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Get existing tables
    const existingTables = await Table.find();
    const existingTableNos = existingTables.map((t) => t.tableNo);

    // Create tables 1 to 10
    for (let i = 1; i <= 10; i++) {
      if (!existingTableNos.includes(i)) {
        await Table.create({ tableNo: i, seats: 4 });
        console.log(`Created Table ${i}`);
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding tables:", error);
    process.exit(1);
  }
};

seedTables();
