import db from "../config/Database.js";

async function addDatePostedColumn() {
  try {
    await db.query(
      "ALTER TABLE `barangs` ADD `date_posted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
    );
    console.log("Successfully added date_posted column with default value");
  } catch (error) {
    console.error("Failed to add date_posted column:", error);
  } finally {
    process.exit();
  }
}

// Connect to the database and run the migration
(async () => {
  try {
    await db.authenticate();
    console.log("Database connection established.");
    await addDatePostedColumn();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
