const sequelize = require('../config/database');

// Modelos
const Cliente = require('./cliente.model');
const Mesa = require('./mesa.model');
const Reserva = require('./reserva.model');
const Cardapio = require('./cardapio.model');
const Entrada = require('./entrada.model');
const PratoPrincipal = require('./pratoPrincipal.model');
const Sobremesa = require('./sobremesa.model');

const models = {
  Cliente,
  Mesa,
  Reserva,
  Cardapio,
  Entrada,
  PratoPrincipal,
  Sobremesa
};

// Inicializar associações de Reserva/Cliente/Mesa
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Associações do Cardapio
Cardapio.belongsToMany(Entrada, { through: 'CardapioEntradas' });
Entrada.belongsToMany(Cardapio, { through: 'CardapioEntradas' });

Cardapio.belongsToMany(PratoPrincipal, { through: 'CardapioPratos' });
PratoPrincipal.belongsToMany(Cardapio, { through: 'CardapioPratos' });

Cardapio.belongsToMany(Sobremesa, { through: 'CardapioSobremesas' });
Sobremesa.belongsToMany(Cardapio, { through: 'CardapioSobremesas' });

module.exports = { ...models, sequelize };
