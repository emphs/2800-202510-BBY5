import { createPool } from "mysql2";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = createPool({
  host: process.env.AIVEN_HOST,
  port: process.env.AIVEN_PORT,
  user: process.env.AIVEN_USER,
  password: process.env.AIVEN_PASSWORD,
  database: process.env.AIVEN_DATABASE,
  ssl: { ca: readFileSync(__dirname + "/ca.pem") },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
