import mysql from "mysql";

// Create a connection pool instead of a single connection
export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "blog",
});

// Check if the connection is successful
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database successfully!");
});

// Handle errors
db.on("error", (err) => {
  console.error("MySQL database error:", err);
});
