const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'id'
        }
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: true
});

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Product;