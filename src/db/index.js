import mysql from 'mysql2/promise'
import { DB_NAME } from "../constants.js";
import Sequelize from 'sequelize';
import UserModel from '../models/users.model.js';
import EntityModel from '../models/entities.model.js';

const connectDB = async () => {
    try {
        const pool = await mysql.createPool({
            host: `${process.env.DB_HOST}`,
            user: `${process.env.DB_USER}`,
            password: `${process.env.DB_PASSWORD}`,
            database: `${DB_NAME}`
        })
        return pool
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

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: `${process.env.DB_HOST}`,
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${DB_NAME}`
})

const User = UserModel(sequelize, Sequelize.DataTypes)
const Entity = EntityModel(sequelize, Sequelize.DataTypes)

await sequelize.sync()

export default setupDB
export { User, Entity }