const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entrada = sequelize.define('Entrada', {
    nome: DataTypes.STRING,
    ingredientes: DataTypes.STRING,
    preco: DataTypes.INTEGER
});

module.exports = Entrada;

