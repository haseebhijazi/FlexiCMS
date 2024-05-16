import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../db/index.js'
import Sequelize from "sequelize"
import jwt from "jsonwebtoken"

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
        throw new ApiError(400, "Provide the necessary fields!")
    }

    if (username.endsWith('_')) {
        throw new ApiError(403, "Username ends with an underscore (_)")
    }

    // check uniqueness
    const existingUsers = await User.findAll({
        where: {
            [Sequelize.Op.or]: [{ username }, { email }]
        }
    })
    if (existingUsers.length > 0) {
        console.log("username: ", existingUsers.username)
        throw new ApiError(409, "User with this username or email already exists!")
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
    return res.status(201)
    .json(
        new ApiResponse(
            201, 
            createdUser, 
            "User registered successfully!"
        )
    )
})

const loginUser = asyncHandler( async (req, res) => {
    // fetch user details from the front-end
    const {username, email, hashed_password} = req.body

    // validate the details
    if (!username && !email) {
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
    const isPasswordValid = await user.checkPassword(hashed_password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials: username/email or password!")
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
        // secure: true
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

const logoutUser = asyncHandler( async (req, res) => {
    try {
        const updatedRows = await User.update(
            { refreshToken: null },
            {
                where: {
                    user_id: req.user.user_id
                },
            },
        );

        if (updatedRows[0] === 0) {
            throw new ApiError(500, "Failed to logout user");
        }

        return res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json(new ApiResponse(200, {}, "User logged Out"));
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to logout user");
    }
})

const refreshTheAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Access while refreshing session!")
    }

    try {
        const decoded_token = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET 
        )
    
        const user = await User.findByPk(decoded_token?.user_id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token!")
        }
    
        if (incomingRefreshToken != user?.refreshToken) {
            throw new ApiError(401, "Refresh token is either expired or in use!")
        }
    
        const options = {
            httpOnly: true 
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user.user_id)
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
             new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken  },
                "Access token refreshed!"
             )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token.")
    }
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confPassword } = req.body

    if (newPassword != confPassword) {
        throw new ApiError(401, "Passwords do not match.")
    }

    const user = await User.findByPk(req?.user.user_id)
    
    if (!user) {
        throw new ApiError(501, "Authentication issue! Try logging-in again.")
    }

    const isPasswordValid = user.checkPassword(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password.")
    }

    user.hashed_password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password has been changed successfully!"
    ))
})

const fetchCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req?.user.user_id)

    if (!user) {
        throw new ApiError(401, "User not authenticated.");
    }
    return res.status(200)
    .json(new ApiResponse(
        200,
        {
            user: user
        },
        "Current user info fetched successfully!"
    ))
})

export { 
    registerUser, 
    loginUser,
    logoutUser,
    refreshTheAccessToken,
    changePassword,
    fetchCurrentUser
}