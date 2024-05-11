import mysql from 'mysql2/promise'
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const pool = await mysql.createPool({
            host: `${process.env.DB_HOST}`,
            user: `${process.env.DB_USER}`,
            password: `${process.env.DB_PASSWORD}`,
            database: `${DB_NAME}`
        })
        return pool
        // const grantSql = `GRANT CREATE ON *.* TO ${process.env.DB_USER}@${process.env.DB_HOST};`
        // await pool.execute(grantSql)
    } catch (error) {
        console.log("🌐 MySQL Connection Failed:", error)
        throw error
    }
}

const createDB = async (pool, databaseName) => {
    try {
        await pool.execute(`CREATE DATABASE IF NOT EXISTS ${databaseName}`)
        console.log(`MySQL Database '${databaseName}' created successfully.`)
    } catch (error) {
        console.error("MySQL Error creating database:", error)
        throw error
    }
}

const setupDB = async () => {
    try {
        const pool = await connectDB()
        await createDB(pool, `${ DB_NAME }`)
        return pool
    } catch (error) {
        console.error("MySQL Database Setup Failed: ", error)
        throw error
    }
}

export default setupDB