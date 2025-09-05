// Script para testar conexão com Supabase
// Cole este código no console do navegador (F12 → Console)

console.log('=== TESTE DE CONEXÃO SUPABASE ===');

// Verificar variáveis de ambiente
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'NÃO DEFINIDA');

// Testar conexão simples
const testConnection = async () => {
  try {
    console.log('Testando conexão básica...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error);
    } else {
      console.log('✅ Conexão OK:', data);
    }
  } catch (err) {
    console.error('❌ Erro catch:', err);
  }
};

testConnection();
