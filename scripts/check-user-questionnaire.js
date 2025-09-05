// Script para verificar se há dados do questionário para o usuário atual
const { createClient } = require('@supabase/supabase-js');

// Usar as variáveis de ambiente do Vite
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🔍 Verificando configuração do Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Presente' : 'Ausente');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
  console.error('❌ Configuração do Supabase não encontrada ou inválida');
  console.log('Verifique se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserQuestionnaire() {
  try {
    console.log('\n🔍 Verificando dados na tabela questionario_multistep...\n');
    
    // Listar todos os registros da tabela questionario_multistep
    const { data, error } = await supabase
      .from('questionario_multistep')
      .select('id, user_id, nome_completo, status_completo, timestamp_cadastro, etapas_completas, total_etapas')
      .order('timestamp_cadastro', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar dados:', error);
      return;
    }
    
    console.log(`📊 Total de registros encontrados: ${data.length}`);
    
    if (data.length === 0) {
      console.log('⚠️  Nenhum registro encontrado na tabela questionario_multistep');
      console.log('Isso explica por que o questionário não aparece no dashboard');
    } else {
      console.log('\n📋 Registros encontrados:');
      data.forEach((record, index) => {
        console.log(`\n${index + 1}. ID: ${record.id}`);
        console.log(`   User ID: ${record.user_id}`);
        console.log(`   Nome: ${record.nome_completo || 'N/A'}`);
        console.log(`   Status: ${record.status_completo ? 'Completo' : 'Em andamento'}`);
        console.log(`   Etapas: ${record.etapas_completas || 0}/${record.total_etapas || 0}`);
        console.log(`   Data: ${record.timestamp_cadastro}`);
      });
    }
    
    // Verificar também a tabela profiles para ver usuários cadastrados
    console.log('\n🔍 Verificando usuários na tabela profiles...\n');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
    } else {
      console.log(`👥 Total de usuários cadastrados: ${profiles.length}`);
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.email} (${profile.full_name || 'Sem nome'}) - ${profile.created_at}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkUserQuestionnaire();

