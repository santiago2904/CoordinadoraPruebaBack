const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");
const ModelEvents = require("./events");
const ModelUsers = require("./users");

const EventAttendee = sequelize.define(
    "event_attendees",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        attendance_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: 'event_attendees',
    }
);

EventAttendee.belongsTo(ModelEvents, {
    foreignKey: 'event_id',
    as: 'event'
});

EventAttendee.belongsTo(ModelUsers, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = EventAttendee;
