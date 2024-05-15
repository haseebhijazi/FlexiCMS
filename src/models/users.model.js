import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Model, DataTypes } from 'sequelize'

class User extends Model {
    async checkPassword(password) {
        return await bcrypt.compare(password, this.hashed_password);
    }

    async generateAccessToken() {
        return await jwt.sign({
            user_id: this.user_id,
            email: this.email,
            username: this.username,
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
    }
    
    async generateRefreshToken() {
        return await jwt.sign({
            user_id: this.user_id,
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
    }
}

export default (sequelize) => {
    User.init({
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
        },
        refreshToken: {
            type: DataTypes.STRING,
        }
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'User',
        hooks: {
            beforeCreate: async (user) => {
                user.hashed_password = await bcrypt.hash(user.hashed_password, 10);
            },
            beforeUpdate: async (user) => {
                if (user.changed('hashed_password')) {
                    user.hashed_password = await bcrypt.hash(user.hashed_password, 10);
                }
            }
        }
    });

    return User;
}