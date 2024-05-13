export default (sequelize, DataTypes) => {
    const Entity = sequelize.define('Entity', {
        entities_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entity_logical_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        entity_display_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    return Entity
}