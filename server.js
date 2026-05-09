const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://mqldjixmeahjxydyjfxb.supabase.co';
const supabaseKey = 'sb_secret_x-VUZKkpF9wwkLE059sfVg_YCURVnLT';

const supabase = createClient(supabaseUrl, supabaseKey);

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const CAMINHO_ARQUIVO = './agendamentos.json';

// --- ROTA PARA LER ---
// BUSCAR TODOS OS AGENDAMENTOS (Para o Dashboard)
app.get('/agendamentos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('agendamentos').select('*');
    
    if (error) {
      return res.status(500).json({ erro: error.message });
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: "Falha interna no servidor" });
  }
});


// --- ROTA PARA ATUALIZAR (Onde o desconto acontece) ---
app.put('/agendamentos/:id', (req, res) => {
  const { id } = req.params;
  const agendamentoAtualizado = req.body;

  try {
    if (!fs.existsSync(CAMINHO_ARQUIVO)) return res.status(404).send("Arquivo não encontrado");
    
    const data = fs.readFileSync(CAMINHO_ARQUIVO, 'utf8');
    let agendamentos = JSON.parse(data || '[]');

    // Procura o agendamento pelo ID
    const index = agendamentos.findIndex(item => String(item.id) === String(id));

    if (index !== -1) {
      agendamentos[index] = agendamentoAtualizado;
      fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(agendamentos, null, 2));
      console.log(`✅ Agendamento ${id} atualizado!`);
      res.json({ message: "Atualizado com sucesso!" });
    } else {
      console.log(`❌ ID ${id} não encontrado no arquivo.`);
      res.status(404).json({ message: "Agendamento não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
  module.exports = app;
});