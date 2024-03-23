const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");
const ModelRoles = require("./roles"); // Asegúrate de que la ruta sea correcta según la ubicación del archivo de modelo para Roles

const ModelUsers = sequelize.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        identification: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 6),
            allowNull: false,
        },
        id_rol: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: true,
        tableName: 'users',
    }
);


ModelUsers.belongsTo(ModelRoles, {
    foreignKey: 'id_rol',
    as: 'rol'
});


ModelUsers.findForLoginDataByEmail = async (email) => {
    return ModelUsers.findOne({
        where: {
            email: email
        },
        include: {
            model: ModelRoles,
            as: 'rol',
        }
    });
}

module.exports = ModelUsers;