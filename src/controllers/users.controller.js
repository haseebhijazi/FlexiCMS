import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../db/index.js'
import Sequelize from "sequelize"

const generateAccessAndRefreshTokens = async (user_id) => {
    try {
        const user = await User.findByPk(user_id)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.accessToken = accessToken
        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Tokens generation failed!")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // fetch user details from the front-end
    const {username, email, hashed_password} = req.body

    // validate the details - not empty (for non-NULL)
    if (
        [username, email, hashed_password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "Provide the necessary fields")
    }

    // check uniqueness
    const existingUsers = await User.findAll({
        where: {
            [Sequelize.Op.or]: [{ username }, { email }]
        }
    })
    if (existingUsers.length > 0) {
        console.log("username: ", existingUsers.username)
        throw new ApiError(409, "User with this username or email already exists")
    }

    // create user object and insert in the db
    const user = await User.create({
        username: `${username}`,
        email: `${email}`,
        hashed_password: `${hashed_password}`
    })
    console.log("username: ", user.username)

    // check user creation and remove sensitive data from the response (res)
    const createdUser = await User.findByPk(user.user_id, {
        atrributes: {
            exclude: ['hashed_password', 'refreshToken']
        }
    })
    if (!createdUser) {
        throw new ApiError(500, "User creation failed!")
    }

    // return response (res)
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully!")
    )
})

const loginUser = asyncHandler( async (req, res) => {
    // fetch user details from the front-end
    const {username, email, hashed_password} = req.body

    // validate the details
    if (!username || !email) {
        throw new ApiError(400, "Username or Email is required for login!")
    }

    // fetch user
    const users = await User.findAll({
        where: {
            [Sequelize.Op.or]: [{ username }, { email }]
        }
    })

    if (users.length === 0) {
        throw new ApiError(404, "No user registered with such username or email!")
    }

    // authenticate
    const user = users[0]
    console.log("username: ", user.username);
    const isPasswordValid = user.checkPassword(hashed_password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials: username/email or password")
    }

    //tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.user_id)

    //cookies
    const loggedInUser = await User.findByPk(user.user_id, {
        atrributes: {
            exclude: ['hashed_password', 'refreshToken']
        }
    })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken

            },
            "User logged in sucessfully!"
        )
    )
})

export { 
    registerUser, 
    loginUser
}