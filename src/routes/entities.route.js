import { Router } from "express"
import { createEntity } from "../controllers/entities.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/create-entity").post(verifyJWT, createEntity) // Create
// router.route("/read-entities").get(readAllEntities) // Read
// router.route("/delete-entity").post(deleteEntity) // Delete

// updating schema of an Entity does not make sense, as it will anyways be drop and create
// for Entity name update we might have a route though

// router.route("/insert-row").post(insertRow) // Create
// router.route("/read-rows").get(readRows)    // Read
// router.route("/update-row").post(updateRow) // Update
// router.route("/delete-row").post(deleteRow) // Delete

export default router