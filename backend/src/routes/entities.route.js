import { Router } from "express"
import { createEntity, readAllEntities, renameEntity, deleteEntity } from "../controllers/entities.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/create-entity").post(verifyJWT, createEntity)                // Create Entity for logged-in user
router.route("/read-entities").get(verifyJWT, readAllEntities)              // Read Entities created by logged-in user
router.route("/rename-entity").put(verifyJWT, renameEntity)                 // Update Entity name created by logged-in user
// updating schema of an Entity does not make sense, as it will anyways be "drop and create" (routes exist)
router.route("/delete-entity").post(verifyJWT, deleteEntity)                // Delete Entity of logged-in user

export default router