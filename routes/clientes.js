const express = require('express');
const router = express.Router();
const supabase = require('../supabase'); 

router.post('/clientes', async (req, res) => {
    console.log("O que chegou do frontend:", req.body);
    const { data, error } = await supabase.from('cadastroCliente').insert([req.body]);
    if (error) return res.status(500).json({ erro: error.message });
    res.status(201).json({ mensagem: "Cliente salvo com sucesso!", data });
  });
  
  router.get('/busca', async (req, res) => {
    const nomeBuscado = req.query.nome;
    const { data, error } = await supabase.from('cadastroCliente').select('nome,telefone').ilike('nome',`%${nomeBuscado}%`);
    if (error) return res.status(500).json({ erro: error.message });
      res.json(data);
  });

module.exports = router; 