import { Router } from "express"
import { insertRow, readRows, updateRow, deleteRow, fetchSchema } from "../controllers/rows.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/insert-row").post(verifyJWT, insertRow) // Create
router.route("/read-rows").post(verifyJWT, readRows)    // Read
router.route("/update-row").put(verifyJWT, updateRow)  // Update
router.route("/delete-row").post(verifyJWT, deleteRow) // Delete
router.route("/fetch-schema").post(verifyJWT, fetchSchema)

export default router