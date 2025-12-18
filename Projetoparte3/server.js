const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const { Cliente, Mesa, Reserva, Entrada, PratoPrincipal, Sobremesa, Bebida, sequelize } = require('./models');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// ====================== ROTAS ESTÁTICAS ======================
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/desenvolvedores', (req, res) => {
    res.render('desenvolvedores');
});

app.get('/cardapio', (req, res) => {
    res.render('cardapio'); // página estática
});

// ====================== ROTAS DINÂMICAS ======================
app.get('/cardapiodef', async (req, res) => {
    try {
        const entradas = await Entrada.findAll({ raw: true });
        const pratosPrincipais = await PratoPrincipal.findAll({ raw: true });
        const sobremesas = await Sobremesa.findAll({ raw: true });

        res.render('cardapiodef', {
            entradas,
            pratosPrincipais,
            sobremesas
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Erro ao carregar cardápio");
    }
});

// ====================== ROTAS DE CLIENTE ======================
app.get('/cliente', async (req, res) => {
    try {
        const clientes = await Cliente.findAll({ raw: true });
        res.render('cliente/listar', { clientes });
    } catch (e) {
        console.error(e);
        res.status(500).send("Erro ao buscar clientes");
    }
});

app.get('/cliente/cadastrar', (req, res) => {
    res.render('cliente/cadastrar');
});

app.post('/cliente/cadastrar', async (req, res) => {
    try {
        await Cliente.create(req.body);
        res.redirect('/cliente');
    } catch (e) {
        res.status(500).send("Erro ao cadastrar cliente");
    }
});

app.get('/cliente/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, { raw: true });
        if (!cliente) return res.status(404).send("Cliente não encontrado");
        res.render('cliente/detalhar', { cliente });
    } catch (e) {
        res.status(500).send("Erro ao detalhar cliente");
    }
});

app.get('/cliente/:id/editar', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, { raw: true });
        res.render('cliente/editar', { cliente });
    } catch (e) {
        res.status(500).send("Erro ao editar cliente");
    }
});

app.post('/cliente/:id/editar', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        await cliente.update(req.body);
        res.redirect('/cliente');
    } catch (e) {
        res.status(500).send("Erro ao atualizar cliente");
    }
});

app.post('/cliente/:id/deletar', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        await cliente.destroy();
        res.redirect('/cliente');
    } catch (e) {
        res.status(500).send("Erro ao deletar cliente");
    }
});

// ====================== ROTAS DE MESA ======================
app.get('/mesa', async (req, res) => {
    try {
        const mesas = await Mesa.findAll({ raw: true });
        res.render('mesa/listar', { mesas });
    } catch (e) {
        res.status(500).send("Erro ao buscar mesas");
    }
});

app.get('/mesa/cadastrar', (req, res) => {
    res.render('mesa/cadastrar');
});

app.post('/mesa/cadastrar', async (req, res) => {
    try {
        await Mesa.create(req.body);
        res.redirect('/mesa');
    } catch (e) {
        res.status(500).send("Erro ao cadastrar mesa");
    }
});

app.get('/mesa/:id/editar', async (req, res) => {
    try {
        const mesa = await Mesa.findByPk(req.params.id, { raw: true });
        res.render('mesa/editar', { mesa });
    } catch (e) {
        res.status(500).send("Erro ao editar mesa");
    }
});

app.post('/mesa/:id/editar', async (req, res) => {
    try {
        const mesa = await Mesa.findByPk(req.params.id);
        await mesa.update(req.body);
        res.redirect('/mesa');
    } catch (e) {
        res.status(500).send("Erro ao atualizar mesa");
    }
});

app.post('/mesa/:id/deletar', async (req, res) => {
    try {
        const mesa = await Mesa.findByPk(req.params.id);
        await mesa.destroy();
        res.redirect('/mesa');
    } catch (e) {
        res.status(500).send("Erro ao deletar mesa");
    }
});

// ====================== ROTAS DE RESERVA ======================
app.get('/reserva', async (req, res) => {
  try {
    const reservasDB = await Reserva.findAll({
      include: [
        { model: Cliente },
        { model: Mesa }
      ]
    });

    const reservas = reservasDB.map(reserva => reserva.get({ plain: true }));

    res.render('reserva/listar', { reservas });
  } catch (e) {
    console.error(e);
    res.status(500).send("Erro ao buscar reservas");
  }
});

app.get('/reserva/cadastrar', async (req, res) => {
    const clientes = await Cliente.findAll({ raw: true });
    const mesas = await Mesa.findAll({ raw: true });
    res.render('reserva/cadastrar', { clientes, mesas });
});

app.post('/reserva/cadastrar', async (req, res) => {
    try {
        await Reserva.create(req.body);
        res.redirect('/reserva');
    } catch (e) {
        res.status(500).send("Erro ao cadastrar reserva");
    }
});

app.post('/reserva/:id/deletar', async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        await reserva.destroy();
        res.redirect('/reserva');
    } catch (e) {
        res.status(500).send("Erro ao deletar reserva");
    }
});

// ====================== ROTAS DE ENTRADA ======================
app.get('/entrada', async (req, res) => {
    try {
        const entradas = await Entrada.findAll({ raw: true });
        res.render('entrada/listar', { entradas });
    } catch (e) {
        res.status(500).send("Erro ao buscar entradas");
    }
});

app.get('/entrada/cadastrar', (req, res) => res.render('entrada/cadastrar'));

app.post('/entrada/cadastrar', async (req, res) => {
    try {
        await Entrada.create(req.body);
        res.redirect('/entrada');
    } catch (e) {
        res.status(500).send("Erro ao cadastrar entrada");
    }
});

app.get('/entrada/:id', async (req, res) => {
    try {
        const entrada = await Entrada.findByPk(req.params.id, { raw: true });
        if (!entrada) return res.status(404).send("Entrada não encontrada");
        res.render('entrada/detalhar', { entrada });
    } catch (e) {
        res.status(500).send("Erro ao detalhar entrada");
    }
});

app.get('/entrada/:id/editar', async (req, res) => {
    try {
        const entrada = await Entrada.findByPk(req.params.id, { raw: true });
        res.render('entrada/editar', { entrada });
    } catch (e) {
        res.status(500).send("Erro ao editar entrada");
    }
});

app.post('/entrada/:id/editar', async (req, res) => {
    try {
        const entrada = await Entrada.findByPk(req.params.id);
        await entrada.update(req.body);
        res.redirect('/entrada');
    } catch (e) {
        res.status(500).send("Erro ao atualizar entrada");
    }
});

app.post('/entrada/:id/deletar', async (req, res) => {
    try {
        const entrada = await Entrada.findByPk(req.params.id);
        await entrada.destroy();
        res.redirect('/entrada');
    } catch (e) {
        res.status(500).send("Erro ao deletar entrada");
    }
});

// ====================== ROTAS DE PRATO PRINCIPAL ======================
app.get('/pratoPrincipal', async (req, res) => {
    try {
        const pratosPrincipais = await PratoPrincipal.findAll({ raw: true });
        res.render('pratoPrincipal/listar', { pratosPrincipais });
    } catch (e) {
        res.status(500).send("Erro ao buscar Prato Principal");
    }
});

app.get('/pratoPrincipal/cadastrar', (req, res) => res.render('pratoPrincipal/cadastrar'));

app.post('/pratoPrincipal/cadastrar', async (req, res) => {
    try {
        await PratoPrincipal.create(req.body);
        res.redirect('/pratoPrincipal');
    } catch (e) {
        res.status(500).send("Erro ao cadastrar pratoPrincipal");
    }
});

app.get('/pratoPrincipal/:id', async (req, res) => {
    try {
        const prato = await PratoPrincipal.findByPk(req.params.id, { raw: true });
        if (!prato) return res.status(404).send("Prato Principal não encontrado");
        res.render('pratoPrincipal/detalhar', { prato });
    } catch (e) {
        res.status(500).send("Erro ao detalhar Prato Principal");
    }
});

app.get('/pratoPrincipal/:id/editar', async (req, res) => {
    try {
        const prato = await PratoPrincipal.findByPk(req.params.id, { raw: true });
        res.render('pratoPrincipal/editar', { prato });
    } catch (e) {
        res.status(500).send("Erro ao editar Prato Principal");
    }
});

app.post('/pratoPrincipal/:id/editar', async (req, res) => {
    try {
        const prato = await PratoPrincipal.findByPk(req.params.id);
        await prato.update(req.body);
        res.redirect('/pratoPrincipal');
    } catch (e) {
        res.status(500).send("Erro ao atualizar Prato Principal");
    }
});

app.post('/pratoPrincipal/:id/deletar', async (req, res) => {
    try {
        const prato = await PratoPrincipal.findByPk(req.params.id);
        await prato.destroy();
        res.redirect('/pratoPrincipal');
    } catch (e) {
        res.status(500).send("Erro ao deletar Prato Principal");
    }
});

// ====================== ROTAS DE SOBREMESA ======================
app.get('/Sobremesa', async (req, res) => {
    try {
        const sobremesas = await Sobremesa.findAll({ raw: true });
        res.render('Sobremesa/listar', { sobremesas });
    } catch (e) {
        res.status(500).send("Erro ao buscar Sobremesa");
    }
});

app.get('/Sobremesa/cadastrar', (req, res) => res.render('Sobremesa/cadastrar'));

app.post('/Sobremesa/cadastrar', async (req, res) => {
    try {
        await Sobremesa.create(req.body);
        res.redirect("/Sobremesa");
    } catch (e) {
        res.status(500).send("Erro ao cadastrar Sobremesa");
    }
});

app.get('/Sobremesa/:id', async (req, res) => {
    try {
        const sobremesa = await Sobremesa.findByPk(req.params.id, { raw: true });
        if (!sobremesa) return res.status(404).send("Sobremesa não encontrada");
        res.render('Sobremesa/detalhar', { sobremesa });
    } catch (e) {
        res.status(500).send("Erro ao detalhar Sobremesa");
    }
});

app.get('/Sobremesa/:id/editar', async (req, res) => {
    try {
        const sobremesa = await Sobremesa.findByPk(req.params.id, { raw: true });
        res.render('Sobremesa/editar', { sobremesa });
    } catch (e) {
        res.status(500).send("Erro ao editar Sobremesa");
    }
});

app.post('/Sobremesa/:id/editar', async (req, res) => {
    try {
        const sobremesa = await Sobremesa.findByPk(req.params.id);
        await sobremesa.update(req.body);
        res.redirect('/Sobremesa');
    } catch (e) {
        res.status(500).send("Erro ao atualizar Sobremesa");
    }
});

app.post('/Sobremesa/:id/deletar', async (req, res) => {
    try {
        const sobremesa = await Sobremesa.findByPk(req.params.id);
        await sobremesa.destroy();
        res.redirect('/Sobremesa');
    } catch (e) {
        res.status(500).send("Erro ao deletar Sobremesa");
    }
});

// ====================== ROTAS DE BEBIDAS ======================
app.get('/Bebida', async (req, res) => {
    try {
        const bebidas = await Sobremesa.findAll({ raw: true });
        res.render('Bebida/listar', { bebidas });
    } catch (e) {
        res.status(500).send("Erro ao buscar Bebida");
    }
});

app.get('/Bebida/cadastrar', (req, res) => res.render('Bebida/cadastrar'));

app.post('/Bebida/cadastrar', async (req, res) => {
    try {
        await Bebida.create(req.body);
        res.redirect("/Bebida");
    } catch (e) {
        res.status(500).send("Erro ao cadastrar Bebida");
    }
});

app.get('/Bebida/:id', async (req, res) => {
    try {
        const bebidas = await Bebida.findByPk(req.params.id, { raw: true });
        if (!bebidas) return res.status(404).send("Bebida não encontrada");
        res.render('Bebida/detalhar', { bebidas });
    } catch (e) {
        res.status(500).send("Erro ao detalhar Bebida");
    }
});

app.get('/Bebida/:id/editar', async (req, res) => {
    try {
        const bebidas = await Bebida.findByPk(req.params.id, { raw: true });
        res.render('Bebida/editar', { bebidas });
    } catch (e) {
        res.status(500).send("Erro ao editar Bebida");
    }
});

app.post('/Bebida/:id/editar', async (req, res) => {
    try {
        const bebidas = await Bebida.findByPk(req.params.id);
        await bebidas.update(req.body);
        res.redirect('/Bebida');
    } catch (e) {
        res.status(500).send("Erro ao atualizar Bebida");
    }
});

app.post('/Bebida/:id/deletar', async (req, res) => {
    try {
        const bebidas = await Bebida.findByPk(req.params.id);
        await bebidas.destroy();
        res.redirect('/Bebida');
    } catch (e) {
        res.status(500).send("Erro ao deletar Bebida");
    }
});

// ====================== SINCRONIZAÇÃO DO BANCO ======================
sequelize.sync()
    .then(() => console.log("Banco sincronizado!"))
    .catch(e => console.error("Erro ao sincronizar banco:", e));

// ====================== SERVIDOR ======================
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
