import { Router } from "express"
import { insertRow, readRows, updateRow, deleteRow } from "../controllers/rows.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/insert-row").post(verifyJWT, insertRow) // Create
router.route("/read-rows").get(verifyJWT, readRows)    // Read
router.route("/update-row").put(verifyJWT, updateRow)  // Update
router.route("/delete-row").post(verifyJWT, deleteRow) // Delete

export default router