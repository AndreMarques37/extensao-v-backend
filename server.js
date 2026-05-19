require('dotenv').config()

const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

const origensPermitidas = [
  'https://extensao-v-frontend.vercel.app',
  'http://localhost:9000', 
  'http://localhost:5173', 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (origensPermitidas.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelas políticas de CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/agendamentos', async (req, res) => {
  const { data, error } = await supabase.from('agendamentos').select('*');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

app.post('/agendamentos', async (req, res) => {
  const { data, error } = await supabase.from('agendamentos').insert([req.body]);
  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json({ mensagem: "Salvo com sucesso!", data });
});

app.put('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('agendamentos')
    .update(req.body)
    .eq('id', id);
  if (error) return res.status(500).json({ erro: error.message });
  res.json({ mensagem: "Atualizado com sucesso!" });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
}