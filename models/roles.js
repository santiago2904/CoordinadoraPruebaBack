const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/mysql")

const ModelRoles = sequelize.define(
    "roles",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        timestamps: true,
        tableName: 'roles',
    }
)



module.exports = ModelRoles