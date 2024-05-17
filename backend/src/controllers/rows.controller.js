import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Entity, sequelize } from '../db/index.js'
import Sequelize from "sequelize"

const insertRow = asyncHandler(async (req, res) => {
    const { entity_display_name, values } = req.body

    // Validate the input
    if (!entity_display_name) {
        throw new ApiError(401, "Entity Name not provided.")
    }

    if (!values || Object.keys(values).length === 0) {
        throw new ApiError(401, "Values have not been provided.")
    }

    const user = req?.user; // from JWT
    if (!user) {
        throw new ApiError(401, "Unauthorized Access.")
    }
    const user_id = user.user_id

    // Check if the entity exists for the user
    const entities = await Entity.findAll({
        where: {
            entity_display_name: entity_display_name,
            user_id: user_id
        }
    })
    if (entities.length <= 0) {
        throw new ApiError(409, "Entity with this name does not exist for the user.")
    }

    const entity_logical_name = user.username + '_' + entity_display_name

    // Prepare the columns and values for insertion
    const cols = []
    const placeholders = []
    const vals = []

    for (const [attr_name, attr_val] of Object.entries(values)) {
        if (!attr_name || attr_val === undefined) {
            throw new ApiError(401, "Values not defined properly.")
        }

        cols.push(attr_name)
        placeholders.push('?')
        vals.push(attr_val)
    }

    // Construct and execute the query
    try {
        const query = `INSERT INTO ${entity_logical_name} (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`
        await sequelize.query(query, { replacements: vals })
    } catch (error) {
        throw new ApiError(500, error.message || "Error inserting row.")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Row populated successfully!"
        )
    )
})

const readRows = asyncHandler( async (req, res) => {
    const { entity_display_name } = req.body

    if (!entity_display_name) {
        throw new ApiError(401, "Entity Name not provided.")
    }

    const user = req?.user // from jwt
    if (!user) {
        throw new ApiError(401, "Unauthorized Access.")
    }
    const user_id = user.user_id

    const entities = await Entity.findAll({
        where: {
            entity_display_name: entity_display_name, 
            user_id: user_id
        }
    })
    if (entities.length <= 0) {
        throw new ApiError(409, "Entity with this name does not exist for the user.")
    }

    const entity_logical_name = user.username + '_' + entity_display_name

    try {
        const rows = await sequelize.query(`SELECT * FROM ${entity_logical_name}`)
        return res.status(200)
        .json( 
            new ApiResponse(
                200,
                rows,
                "Rows fetched successfully!"
            )
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching rows.")
    }
})

const updateRow = asyncHandler( async (req, res) => {
    const { entity_display_name, row_id, values } = req.body

    if (!entity_display_name || !row_id) {
        throw new ApiError(401, "Fields not provided.")
    }

    if (!values || Object.keys(values).length === 0) {
        throw new ApiError(401, "Values to update not provided.")
    }

    const user = req?.user // from jwt
    if (!user) {
        throw new ApiError(401, "Unauthorized Access.")
    }
    const user_id = user.user_id

    const entities = await Entity.findAll({
        where: {
            entity_display_name: entity_display_name,
            user_id: user_id
        }
    })
    if (entities.length <= 0) {
        throw new ApiError(409, "Entity with this name does not exist for the user.")
    }

    const entity_logical_name = user.username + '_' + entity_display_name

    // Construct the SET part of the SQL query
    let setClause = ''
    let replacements = []

    for (const [key, value] of Object.entries(values)) {
        setClause += `${key} = ?, `
        replacements.push(value)
    }

    // Remove the last comma and space
    setClause = setClause.slice(0, -2)

    replacements.push(row_id)

    try {
        const query = `UPDATE ${entity_logical_name} SET ${setClause} WHERE id = ?`
        await sequelize.query(query, { replacements })

        res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Row updated successfully!"
            )
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Error updating row.")
    }
})

const deleteRow = asyncHandler( async (req, res) => {
    const { entity_display_name, row_id } = req.body

    if (!entity_display_name || !row_id) {
        throw new ApiError(401, "Fields not provided.")
    }

    const user = req?.user // from jwt
    if (!user) {
        throw new ApiError(401, "Unauthorized Access.")
    }
    const user_id = user.user_id

    const entities = await Entity.findAll({
        where: {
            entity_display_name: entity_display_name, 
            user_id: user_id
        }
    })
    if (entities.length <= 0) {
        throw new ApiError(409, "Entity with this name does not exist for the user.")
    }

    const entity_logical_name = user.username + '_' + entity_display_name

    try {
        await sequelize.query(`DELETE FROM ${entity_logical_name} WHERE id=${row_id}`)
        return res.status(200)
        .json( 
            new ApiResponse(
                200,
                {},
                "Rows deleted successfully!"
            )
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching rows.")
    }
})

export {  
    insertRow, 
    readRows, 
    updateRow,
    deleteRow
}