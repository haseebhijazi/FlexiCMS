import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Entity, sequelize } from '../db/index.js'
import Sequelize from "sequelize"

const createEntity = asyncHandler( async (req, res) => {
    const { entity_display_name, attributes } = req.body

    // validate the data (attr will be validate internally later in the code)
    if (!entity_display_name) {
        throw new ApiError(401, "Entity name not specified.")
    }
    if(attributes.length === 0) {
        throw new ApiError(401, "Specify atleast one attribute.")
    }

    const user_id = req?.user.user_id // from jwt

    // check entity_display_name unqueness for the given user: User cannot have two tables with same name 
    const existingEntities = await Entity.findAll({
        where: {
            [Sequelize.Op.and]: [{ entity_display_name }, { user_id }]
        }
    })
    if (existingEntities.length > 0) {
        throw new ApiError(409, "Entities with the same name exist for the user.")
    }

    const entity_logical_name = req?.user.username + '_' + entity_display_name

    // check entity_logical_name uniqueness in entire Entity Model: it is a unique field in the database
    const entities = await Entity.findAll({
        where: {
            entity_logical_name: entity_logical_name
        }
    })
    if (entities.length > 0) {
        throw new ApiError(502, "Failed to create the entity.")
    }

    const schema = {}
    for (const attribute of attributes) {
        const attr_name = attribute.name
        const attr_type = attribute.type

        // checking for any null value for each attribute
        if (!attr_name || !attr_type) {
            throw new ApiError(401, "Attributes not defined properly.")
        }

        schema[attr_name] = {
            // Assuming attr_type (attribute.type) from front-end matches Sequelize data types. (cannot interfere because of headless nature)
            // Best way is to force the types by drop-down menu or something similar
            type: Sequelize.DataTypes[attr_type] 
        }
    }

    // table creation for the entity
    const tableName = entity_logical_name
    try {
        await sequelize.define(tableName, schema, {freezeTableName: true,}).sync({ force: false })
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to create a table for the Entity.")
    }

    // store the mapping in the Entity table
    const createdEntity = await Entity.create({
        user_id: `${user_id}`,
        entity_logical_name: `${entity_logical_name}`,
        entity_display_name: `${entity_display_name}`
    })
    if (!createdEntity) {
        throw new ApiError(500, "Entity Creation failed.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            createdEntity,
            "Entity created successfully!"
        )
    )
})


const readAllEntities = asyncHandler( async (req, res) => {
    const user = req?.user
    if (!user) {
        throw new ApiError(401, "User not authenticated.")
    }

    const entities = await Entity.findAll({
        where: {
            user_id: user.user_id
        }
    })

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            entities,
            "Entities fetched successfully!"
        )
    )
})
export { 
    createEntity,
    readAllEntities
}