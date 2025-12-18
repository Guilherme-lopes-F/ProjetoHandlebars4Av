const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Mesa extends Model {}

Mesa.init({
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lugares: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Mesa'
});

Mesa.associate = (models) => {
  Mesa.hasMany(models.Reserva, { foreignKey: 'mesa_id' });
};

module.exports = Mesa;
