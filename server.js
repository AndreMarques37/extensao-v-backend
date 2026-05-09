const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');

const supabaseUrl = 'https://mqldjixmeahjxydyjfxb.supabase.co';
const supabaseKey = 'sb_secret_x-VUZKkpF9wwkLE059sfVg_YCURVnLT';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS (Corrigida e única)
app.use(cors({
  origin: 'https://extensao-v-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

// --- ROTA PARA LER (SUPABASE) ---
app.get('/agendamentos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('agendamentos').select('*');
    if (error) return res.status(500).json({ erro: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: "Falha interna no servidor" });
  }
});

// --- ROTA PARA ATUALIZAR (AGORA NO SUPABASE) ---
app.put('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const agendamentoAtualizado = req.body;

  try {
    // Atualiza diretamente no banco, removendo a dependência do arquivo .json
    const { data, error } = await supabase
      .from('agendamentos')
      .update(agendamentoAtualizado)
      .eq('id', id);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    console.log(`✅ Agendamento ${id} atualizado no Supabase!`);
    res.json({ message: "Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// Exportação necessária para a Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`);
  });
}

module.exports = app;