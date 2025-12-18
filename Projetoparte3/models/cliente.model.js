// cliente.model.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cliente extends Model {}

Cliente.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Cliente'
});

// Definir associações em função, sem importar Reserva diretamente
Cliente.associate = (models) => {
  Cliente.hasMany(models.Reserva, {
    foreignKey: 'cliente_id',
    onDelete: 'CASCADE'
  });
};

module.exports = Cliente;
