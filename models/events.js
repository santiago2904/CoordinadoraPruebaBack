const { DataTypes,Op } = require("sequelize");
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
        location: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        max_attendees: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
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

ModelEvents.findAllActive = async () => {
    return await ModelEvents.findAll({
        where: {
            state: true,
        },
        include: [
            {
                model: ModelUsers,
                as: 'creator',
                attributes: ['id', 'name', 'email'],
            },
        ],
    });
};


ModelEvents.findOneByPkActive = async (id) => {
    return await ModelEvents.findOne({
        where: {
            id,
            state: true,
        },
        include: [
            {
                model: ModelUsers,
                as: 'creator',
                attributes: ['id', 'name', 'email'],
            },
        ],
    });
};

ModelEvents.findEventByNameAndDates = async (name, start_date, end_date) => {
    return await ModelEvents.findOne({
        where: {
            name,
            state: true,
            [Op.or]: [
                {
                    start_date: {
                        [Op.between]: [start_date, end_date],
                    },
                },
                {
                    end_date: {
                        [Op.between]: [start_date, end_date],
                    },
                },
            ],
        },
    });
}



module.exports = ModelEvents;