const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Reserva extends Model {}

Reserva.init({
  data_reserva: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Reserva'
});

// Definir associações em uma função, sem importar diretamente Cliente/Mesa
Reserva.associate = (models) => {
  Reserva.belongsTo(models.Cliente, { foreignKey: 'cliente_id', onDelete: 'CASCADE' });
  Reserva.belongsTo(models.Mesa, { foreignKey: 'mesa_id', onDelete: 'CASCADE' });
};

module.exports = Reserva;
