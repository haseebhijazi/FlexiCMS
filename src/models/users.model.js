import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        hashed_password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        instanceMethods: {
            async checkPassword(password) {
                return await bcrypt.compare(password, this.hashed_password);
            },

            async generateAccessToken() {
                return await jwt.sign({
                    user_id: this.user_id,
                    email: this.email,
                    username: this.username,
                }),
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
                }
            },

            async generateRefreshToken() {
                return await jwt.sign({
                    user_id: this.user_id,
                }),
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
                }
            }
        }
    })

    User.addHook('beforeCreate', async (user) => {
        user.hashed_password = await bcrypt.hash(user.hashed_password, 10);
    })

    User.addHook('beforeUpdate', async (user) => {
        if (user.changed('hashed_password')) {
            user.hashed_password = await bcrypt.hash(user.hashed_password, 10);
        }
    })

    return User
}