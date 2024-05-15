import { Router } from "express"
import { createEntity, readAllEntities } from "../controllers/entities.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/create-entity").post(verifyJWT, createEntity)                // Create Entity for logged-in user
router.route("/read-entities").get(verifyJWT, readAllEntities)              // Read Entities created by logged-in user
// router.route("/rename-entity").put(renameEntity)                         // Update Entity name created by logged-in user
// updating schema of an Entity does not make sense, as it will anyways be "drop and create" (routes exist)
// router.route("/delete-entity").post(deleteEntity)                        // Delete Entity of logged-in user


// for Entity name update we might have a route though

// router.route("/insert-row").post(insertRow) // Create
// router.route("/read-rows").get(readRows)    // Read
// router.route("/update-row").post(updateRow) // Update
// router.route("/delete-row").post(deleteRow) // Delete

export default router