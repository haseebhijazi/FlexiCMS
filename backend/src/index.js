import dotenv from "dotenv"
import setupDB from "./db/index.js";
import { User, Entity } from './db/index.js'
import {app} from "./app.js"
dotenv.config({
    path: './env'
})

async function startServer() {
    try {
        const pool = await setupDB();

        app.on("error", (error) => {
            console.log("⚙️ Server Error: ", error);
            throw error;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
        });


        /*
                    ================ QUERY ==================
        // const connection = await pool.getConnection();
        // const [rows] = await connection.query(`SELECT * FROM Persons;`);
        // console.log(rows);
        // connection.release();
                    =========================================
        */
    } catch (error) {
        console.log("🌐 MySQL Connection FAILED <src/index.js> : ", error)
    }
}+



startServer();