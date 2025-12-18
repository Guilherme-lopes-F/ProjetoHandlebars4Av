const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PratoPrincipal = sequelize.define('PratoPrincipal', {
    nome: DataTypes.STRING,
    ingredientes: DataTypes.STRING,
    preco: DataTypes.INTEGER
});

module.exports = PratoPrincipal;

