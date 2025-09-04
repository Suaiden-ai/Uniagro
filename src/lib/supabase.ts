import { createClient } from '@supabase/supabase-js'

// IMPORTANTE: Configure as variáveis de ambiente no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias. ' +
    'Configure-as no arquivo .env'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interface para corresponder à estrutura da tabela "cadastro_inicial"
export interface CadastroInicial {
  id_linha?: number;
  uuid_usuario?: string;
  timestamp_cadastro?: string;
  nome_completo: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string; // Nova coluna que será adicionada
  complemento?: string;
  bairro: string;
  localidade: string;
  estado: string;
  estado_civil: string;
  qtd_filhos: number; // Campo obrigatório no banco
  sexo: string;
}
