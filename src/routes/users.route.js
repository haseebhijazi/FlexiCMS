import { Router } from "express"
import { registerUser } from "../controllers/users.controller.js"
import { loginUser } from "../controllers/users.controller.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

export default router