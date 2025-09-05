// Script de teste para verificar a conversão de valores numéricos
// Execute este script no console do navegador para testar as funções

// Simular as funções de conversão
const toNumeric = (value) => {
  if (value === null || value === undefined || value === '' || value === 0) {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
};

const toStringOrNull = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
};

// Teste com dados similares aos do erro
const testData = {
  profissao1: '',
  rendaProfissao1: 0,
  profissao2: '',
  rendaProfissao2: 0,
  profissao3: '',
  rendaProfissao3: 0,
  rendaTotal: 0,
  bancoFinanciamento: '',
  qualVeiculo: '',
  ondeCasaPropria: ''
};

console.log('=== Teste de Conversão de Valores ===');
console.log('Dados originais:', testData);

const convertedData = {
  renda_profissao1: toStringOrNull(testData.profissao1),
  renda_profissao1_valor: toNumeric(testData.rendaProfissao1),
  renda_profissao2: toStringOrNull(testData.profissao2),
  renda_profissao2_valor: toNumeric(testData.rendaProfissao2),
  renda_profissao3: toStringOrNull(testData.profissao3),
  renda_profissao3_valor: toNumeric(testData.rendaProfissao3),
  renda_total: toNumeric(testData.rendaTotal),
  renda_banco_financiamento: toStringOrNull(testData.bancoFinanciamento),
  renda_qual_veiculo: toStringOrNull(testData.qualVeiculo),
  renda_onde_casa_propria: toStringOrNull(testData.ondeCasaPropria)
};

console.log('Dados convertidos:', convertedData);

// Verificar se todos os valores numéricos são null ou números válidos
const numericFields = ['renda_profissao1_valor', 'renda_profissao2_valor', 'renda_profissao3_valor', 'renda_total'];
const stringFields = ['renda_profissao1', 'renda_profissao2', 'renda_profissao3', 'renda_banco_financiamento', 'renda_qual_veiculo', 'renda_onde_casa_propria'];

console.log('\n=== Verificação de Campos Numéricos ===');
numericFields.forEach(field => {
  const value = convertedData[field];
  const isValid = value === null || (typeof value === 'number' && !isNaN(value));
  console.log(`${field}: ${value} (${typeof value}) - ${isValid ? '✅ Válido' : '❌ Inválido'}`);
});

console.log('\n=== Verificação de Campos de String ===');
stringFields.forEach(field => {
  const value = convertedData[field];
  const isValid = value === null || typeof value === 'string';
  console.log(`${field}: ${value} (${typeof value}) - ${isValid ? '✅ Válido' : '❌ Inválido'}`);
});

console.log('\n=== Teste Concluído ===');
console.log('Se todos os campos mostram "✅ Válido", a conversão está funcionando corretamente!');
