import { Router } from "express"
import { registerUser, loginUser, logoutUser, refreshTheAccessToken, changePassword, fetchCurrentUser } from "../controllers/users.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/user").get(verifyJWT, fetchCurrentUser)

router.route("/logout").get(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshTheAccessToken) 

export default router