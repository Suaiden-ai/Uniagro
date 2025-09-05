const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserData() {
  try {
    console.log('🔍 DEBUG: Verificando dados no banco...\n');
    
    // Listar todos os usuários nas tabelas
    console.log('📋 CADASTRO_INICIAL:');
    const { data: cadastroData, error: cadastroError } = await supabase
      .from('cadastro_inicial')
      .select('id_linha, user_id, nome_completo, timestamp_cadastro')
      .order('timestamp_cadastro', { ascending: false });
    
    if (cadastroError) {
      console.error('❌ Erro ao buscar cadastro_inicial:', cadastroError);
    } else {
      console.log(`✅ Encontrados ${cadastroData.length} registros em cadastro_inicial`);
      cadastroData.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id_linha}, User: ${item.user_id}, Nome: ${item.nome_completo}, Data: ${item.timestamp_cadastro}`);
      });
    }
    
    console.log('\n📋 QUESTIONARIO_MULTISTEP:');
    const { data: questionarioData, error: questionarioError } = await supabase
      .from('questionario_multistep')
      .select('id, user_id, nome_completo, timestamp_cadastro, status_completo, etapas_completas, total_etapas')
      .order('timestamp_cadastro', { ascending: false });
    
    if (questionarioError) {
      console.error('❌ Erro ao buscar questionario_multistep:', questionarioError);
    } else {
      console.log(`✅ Encontrados ${questionarioData.length} registros em questionario_multistep`);
      questionarioData.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id}, User: ${item.user_id}, Nome: ${item.nome_completo}, Data: ${item.timestamp_cadastro}, Completo: ${item.status_completo}, Etapas: ${item.etapas_completas}/${item.total_etapas}`);
      });
    }
    
    console.log('\n📋 PROFILES:');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name, created_at')
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
    } else {
      console.log(`✅ Encontrados ${profilesData.length} perfis`);
      profilesData.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id}, Email: ${item.email}, Nome: ${item.name}, Criado: ${item.created_at}`);
      });
    }
    
    // Verificar se há dados para o usuário específico mencionado na imagem
    const targetEmail = 'gilsonfelipe.cruz3@gmail.com';
    console.log(`\n🎯 Verificando dados para o usuário: ${targetEmail}`);
    
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('email', targetEmail)
      .single();
    
    if (targetProfileError) {
      console.log(`❌ Usuário ${targetEmail} não encontrado em profiles`);
    } else {
      console.log(`✅ Usuário encontrado: ID ${targetProfile.id}, Nome: ${targetProfile.name}`);
      
      // Verificar dados do usuário nas outras tabelas
      const { data: userCadastro } = await supabase
        .from('cadastro_inicial')
        .select('*')
        .eq('user_id', targetProfile.id);
      
      const { data: userQuestionario } = await supabase
        .from('questionario_multistep')
        .select('*')
        .eq('user_id', targetProfile.id);
      
      console.log(`📊 Dados do usuário ${targetEmail}:`);
      console.log(`  - Cadastro inicial: ${userCadastro?.length || 0} registros`);
      console.log(`  - Questionário multistep: ${userQuestionario?.length || 0} registros`);
      
      if (userQuestionario && userQuestionario.length > 0) {
        const questionario = userQuestionario[0];
        console.log(`  - Status completo: ${questionario.status_completo}`);
        console.log(`  - Etapas completas: ${questionario.etapas_completas}/${questionario.total_etapas}`);
        console.log(`  - Nome: ${questionario.nome_completo}`);
        console.log(`  - Data: ${questionario.timestamp_cadastro}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugUserData();

