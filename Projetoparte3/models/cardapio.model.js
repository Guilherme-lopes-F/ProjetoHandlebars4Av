const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entrada = require('./entrada.model');
const PratoPrincipal = require('./pratoPrincipal.model');
const Sobremesa = require('./sobremesa.model');

const Cardapio = sequelize.define('Cardapio', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Associação muitos-para-muitos
Cardapio.belongsToMany(Entrada, { through: 'CardapioEntradas' });
Entrada.belongsToMany(Cardapio, { through: 'CardapioEntradas' });

Cardapio.belongsToMany(PratoPrincipal, { through: 'CardapioPratoPrincipal' });
PratoPrincipal.belongsToMany(Cardapio, { through: 'CardapioPratoPrincipal' });

Cardapio.belongsToMany(Sobremesa, { through: 'CardapioSobremesas' });
Sobremesa.belongsToMany(Cardapio, { through: 'CardapioSobremesas' });

module.exports = Cardapio;

