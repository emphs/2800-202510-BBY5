import { createPool } from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log("AIVEN_HOST:", process.env.AIVEN_HOST);
console.log("AIVEN_PORT:", process.env.AIVEN_PORT);
console.log("AIVEN_USER:", process.env.AIVEN_USER);
console.log("AIVEN_PASSWORD:", process.env.AIVEN_PASSWORD);
console.log("AIVEN_DATABASE:", process.env.AIVEN_DATABASE);

const pool = createPool({
  host: process.env.AIVEN_HOST,
  port: process.env.AIVEN_PORT,
  user: process.env.AIVEN_USER,
  password: process.env.AIVEN_PASSWORD,
  database: process.env.AIVEN_DATABASE,
  ssl: { ca: readFileSync(__dirname + "/ca.pem"), rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
