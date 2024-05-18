import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import { User } from "../db/index.js"


export const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        const token =  req.cookies?.accessToken || (req.headers['authorization'] || req.headers.authorization || '').split(' ')[1]
        
        console.log('Received token:', token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findByPk(decodedToken?.user_id, {
            atrributes: {
                exclude: ['hashed_password', 'refreshToken']
            }
        })
    
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user
    
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Something went wrong with the authorization")
    }
})