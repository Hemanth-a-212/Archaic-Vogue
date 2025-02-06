import pg from "pg"
import "dotenv/config"

const DataBase = process.env.PG_DATABASE;
const UserName = process.env.PG_USER;
const Password = process.env.PG_PASSWORD;
const Host = process.env.PG_HOST;
const Port = process.env.PG_PORT;

const db = new pg.Client({
    connectionString:`postgresql://${UserName}:${Password}@${Host}:${Port}/${DataBase}`, 
    ssl: {
        rejectUnauthorized: false,
    },
});

export default db;