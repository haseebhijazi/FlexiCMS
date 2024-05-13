import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../db/index.js'
import Sequelize from "sequelize"

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
    const existingUser = await User.findAll({
        where: {
            [Sequelize.Op.or]: [{ username }, { email }]
        }
    })
    if (existingUser.length > 0) {
        throw new ApiError(409, "User with this username or email already exists")
    }
    console.log("username: ", username)
    console.log("email: ", email)

    // create user object and insert in the db
    const user = await User.create({
        username: `${username}`,
        email: `${email}`,
        hashed_password: `${hashed_password}`
    })

    // check user creation and remove sensitive data from the response (res)
    const createdUser = await User.findByPk(user.user_id, {
        atrributes: {
            exclude: ['hashed_password']
        }
    })
    if (!createdUser) {
        throw new ApiError(500, "User creation failed!")
    }
    // return response (res)

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )
})

export { registerUser }