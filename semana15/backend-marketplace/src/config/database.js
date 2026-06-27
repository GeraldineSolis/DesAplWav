const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'production' ? false : false, // Siempre false para performance
        pool: {
            max: process.env.NODE_ENV === 'production' ? 5 : 2, // Menos conexiones en dev
            min: 0,
            acquire: 30000,
            idle: 5000 // Reducido para liberar recursos
        },
        dialectOptions: {
            connectTimeout: 10000,
            enableKeepAlive: true,
            keepAliveInitialDelaySeconds: 0
        }
    }
);

module.exports = sequelize;