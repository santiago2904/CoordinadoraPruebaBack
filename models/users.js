const { DataTypes, Op } = require("sequelize");
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
        location: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        timestamps: true,
        tableName: 'users',
    }
);


ModelUsers.belongsTo(ModelRoles, {
    foreignKey: 'id_role',
    as: 'rol'
});


ModelUsers.findForLoginDataByEmail = async (email) => {
    return ModelUsers.findOne({
        where: {
            email: email,
            state: true
        },
        include: {
            model: ModelRoles,
            as: 'rol',
        }
    });
}


//find user by email or identification
ModelUsers.findUserByEmailOrIdentification = async (email, identification) => {
    return ModelUsers.findOne({
        where: {
            [Op.or]: [
                {
                    email: email
                },
                {
                    identification: identification
                }
            ],
            state: true
        }
    });
}

ModelUsers.findAllActice = async () => {
    return ModelUsers.findAll({
        attributes: { exclude: ['password'] },
        include: {
            model: ModelRoles,
            as: 'rol',
        },
        where: {
            state: true
        }
    })
};

ModelUsers.findByPkActive = async (id) => {
    return ModelUsers.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: {
            model: ModelRoles,
            as: 'rol',
        },
        where: {
            state: true
        }
    });
}


module.exports = ModelUsers;