const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bebida = sequelize.define('Bebida', {
    nome: DataTypes.STRING,
    ingredientes: DataTypes.STRING,
    preco: DataTypes.INTEGER
});

module.exports = Bebida;

