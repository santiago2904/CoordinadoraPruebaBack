const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");
const ModelUsers = require("./users");

const ModelEvents = sequelize.define(
    "events",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false,
        },
        max_attendees: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        timestamps: true,
        tableName: 'events',
    }
);

ModelEvents.belongsTo(ModelUsers, {
    foreignKey: 'created_by',
    as: 'creator'
});

module.exports = ModelEvents;