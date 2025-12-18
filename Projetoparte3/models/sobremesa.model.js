const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sobremesa = sequelize.define('Sobremesa', {
    nome: DataTypes.STRING,
    ingredientes: DataTypes.STRING,
    preco: DataTypes.INTEGER
});

module.exports = Sobremesa;

