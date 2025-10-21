-- ============================================
-- SCHEMA DO BANCO DE DADOS
-- Sistema de Geração de Planos de Aula com IA
-- ============================================

-- Tabela de Usuários (Supabase Auth já fornece auth.users)
-- Vamos criar uma tabela de perfil complementar

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    escola TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Planos de Aula
CREATE TABLE IF NOT EXISTS public.planos_aula (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Inputs do usuário
    disciplina TEXT NOT NULL,
    ano_escolar TEXT NOT NULL,
    tema TEXT NOT NULL,
    duracao_minutos INTEGER NOT NULL,
    numero_alunos INTEGER,
    recursos_disponiveis TEXT[],
    objetivos_especificos TEXT,
    
    -- Plano gerado pela IA (JSON estruturado)
    plano_gerado JSONB NOT NULL,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para busca
    CONSTRAINT check_duracao CHECK (duracao_minutos > 0 AND duracao_minutos <= 480)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_planos_user_id ON public.planos_aula(user_id);
CREATE INDEX IF NOT EXISTS idx_planos_disciplina ON public.planos_aula(disciplina);
CREATE INDEX IF NOT EXISTS idx_planos_ano_escolar ON public.planos_aula(ano_escolar);
CREATE INDEX IF NOT EXISTS idx_planos_created_at ON public.planos_aula(created_at DESC);

-- Tabela de Histórico de Gerações (para analytics)
CREATE TABLE IF NOT EXISTS public.geracoes_historico (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plano_id UUID REFERENCES public.planos_aula(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tokens_utilizados INTEGER,
    tempo_geracao_ms INTEGER,
    modelo_ia TEXT NOT NULL,
    sucesso BOOLEAN DEFAULT TRUE,
    erro_mensagem TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planos_aula_updated_at
    BEFORE UPDATE ON public.planos_aula
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_aula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geracoes_historico ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Políticas de segurança para planos_aula
CREATE POLICY "Usuários podem ver seus próprios planos"
    ON public.planos_aula FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios planos"
    ON public.planos_aula FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios planos"
    ON public.planos_aula FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios planos"
    ON public.planos_aula FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas de segurança para geracoes_historico
CREATE POLICY "Usuários podem ver seu próprio histórico"
    ON public.geracoes_historico FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode inserir no histórico"
    ON public.geracoes_historico FOR INSERT
    WITH CHECK (true);
