-- ============================================
-- INSTRUÇÕES DE EXECUÇÃO NO SUPABASE
-- ============================================
-- 1. Acesse: https://supabase.com/dashboard/project/bywxgzdwbnyyepzeptgx
-- 2. Vá em SQL Editor
-- 3. Copie e cole TODO este código
-- 4. Clique em "Run" (Ctrl+Enter)
-- ============================================

-- Limpar tabelas existentes (se necessário)
DROP TABLE IF EXISTS public.geracoes_historico CASCADE;
DROP TABLE IF EXISTS public.planos_aula CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Tabela de Usuários (Supabase Auth já fornece auth.users)
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
    
    CONSTRAINT check_duracao CHECK (duracao_minutos > 0 AND duracao_minutos <= 480)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_planos_user_id ON public.planos_aula(user_id);
CREATE INDEX IF NOT EXISTS idx_planos_disciplina ON public.planos_aula(disciplina);
CREATE INDEX IF NOT EXISTS idx_planos_ano_escolar ON public.planos_aula(ano_escolar);
CREATE INDEX IF NOT EXISTS idx_planos_created_at ON public.planos_aula(created_at DESC);

-- Tabela de Histórico de Gerações
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

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_planos_aula_updated_at
    BEFORE UPDATE ON public.planos_aula
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos_aula ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geracoes_historico ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- POLÍTICAS PARA FUNCIONAR SEM AUTENTICAÇÃO
-- ============================================

-- Permite criar planos SEM autenticação (user_id pode ser NULL)
CREATE POLICY "Qualquer um pode criar planos"
    ON public.planos_aula FOR INSERT
    WITH CHECK (true);

-- Permite visualizar TODOS os planos (para fins de teste/desenvolvimento)
CREATE POLICY "Qualquer um pode ver planos"
    ON public.planos_aula FOR SELECT
    USING (true);

-- Permite atualizar planos próprios OU sem dono
CREATE POLICY "Pode atualizar planos próprios ou sem dono"
    ON public.planos_aula FOR UPDATE
    USING (user_id IS NULL OR auth.uid() = user_id);

-- Permite deletar planos próprios OU sem dono
CREATE POLICY "Pode deletar planos próprios ou sem dono"
    ON public.planos_aula FOR DELETE
    USING (user_id IS NULL OR auth.uid() = user_id);

-- Políticas para histórico
CREATE POLICY "Qualquer um pode ver histórico"
    ON public.geracoes_historico FOR SELECT
    USING (true);

CREATE POLICY "Sistema pode inserir no histórico"
    ON public.geracoes_historico FOR INSERT
    WITH CHECK (true);

-- ============================================
-- MENSAGEM DE SUCESSO
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!';
    RAISE NOTICE '✅ 3 tabelas criadas: profiles, planos_aula, geracoes_historico';
    RAISE NOTICE '✅ RLS configurado (permite uso sem autenticação)';
    RAISE NOTICE '✅ Índices criados para performance';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '1. Configure o arquivo .env com as credenciais';
    RAISE NOTICE '2. Execute: npm start';
    RAISE NOTICE '3. Acesse: http://localhost:3000';
END $$;
