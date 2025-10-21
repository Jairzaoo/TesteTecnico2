// Elementos DOM
const planoForm = document.getElementById('planoForm');
const gerarBtn = document.getElementById('gerarBtn');
const btnText = gerarBtn.querySelector('.btn-text');
const btnLoading = gerarBtn.querySelector('.btn-loading');
const formSection = document.getElementById('formSection');
const resultSection = document.getElementById('resultSection');
const planoContent = document.getElementById('planoContent');
const errorMessage = document.getElementById('errorMessage');
const novoPlanoBtn = document.getElementById('novoPlanoBtn');
const imprimirBtn = document.getElementById('imprimirBtn');
const copiarBtn = document.getElementById('copiarBtn');

let ultimoPlanoGerado = null;

// Event Listeners
planoForm.addEventListener('submit', handleSubmit);
novoPlanoBtn.addEventListener('click', novoPlano);
imprimirBtn.addEventListener('click', imprimir);
copiarBtn.addEventListener('click', copiarJSON);

// Função principal para gerar plano
async function handleSubmit(e) {
    e.preventDefault();
    
    // Limpar erros anteriores
    errorMessage.style.display = 'none';
    
    // Coletar dados do formulário
    const formData = {
        disciplina: document.getElementById('disciplina').value,
        ano_escolar: document.getElementById('ano_escolar').value,
        tema: document.getElementById('tema').value,
        duracao_minutos: parseInt(document.getElementById('duracao_minutos').value),
        numero_alunos: parseInt(document.getElementById('numero_alunos').value) || null,
        recursos_disponiveis: Array.from(document.querySelectorAll('.checkbox-group input:checked'))
            .map(cb => cb.value),
        objetivos_especificos: document.getElementById('objetivos_especificos').value || null
    };

    // Validações
    if (formData.duracao_minutos < 15 || formData.duracao_minutos > 480) {
        mostrarErro('A duração deve ser entre 15 e 480 minutos.');
        return;
    }

    // Mostrar loading
    gerarBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';

    try {
        // Fazer requisição para API
        const response = await fetch('/api/gerar-plano', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok || data.erro) {
            throw new Error(data.mensagem || 'Erro ao gerar plano de aula');
        }

        // Sucesso - exibir plano
        ultimoPlanoGerado = data;
        exibirPlano(data.plano);
        
        // Mostrar seção de resultado
        formSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Erro:', error);
        mostrarErro(error.message);
    } finally {
        // Remover loading
        gerarBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Função para exibir o plano gerado
function exibirPlano(plano) {
    const html = `
        <div class="plano-section">
            <h3>🎭 Introdução Lúdica</h3>
            <p>${plano.introducao_ludica}</p>
        </div>

        <div class="plano-section">
            <h3>🎯 Objetivo de Aprendizagem (BNCC)</h3>
            <div class="objetivo-bncc">
                <div class="codigo">${plano.objetivo_bncc.codigo}</div>
                <p>${plano.objetivo_bncc.descricao}</p>
            </div>
        </div>

        <div class="plano-section">
            <h3>📋 Passo a Passo da Atividade</h3>
            ${plano.passo_a_passo.map(passo => `
                <div class="passo-item">
                    <h4>
                        ${passo.numero}. ${passo.titulo}
                        <span class="passo-duracao">⏱️ ${passo.duracao_minutos} min</span>
                    </h4>
                    <p>${passo.descricao}</p>
                    ${passo.materiais && passo.materiais.length > 0 ? `
                        <div class="materiais-list">
                            <strong>Materiais:</strong>
                            ${passo.materiais.map(mat => `<span class="material-tag">${mat}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>

        <div class="plano-section">
            <h3>✅ Rubrica de Avaliação</h3>
            <table class="rubrica-table">
                <thead>
                    <tr>
                        <th>Critério</th>
                        <th>Insuficiente</th>
                        <th>Básico</th>
                        <th>Proficiente</th>
                        <th>Avançado</th>
                    </tr>
                </thead>
                <tbody>
                    ${plano.rubrica_avaliacao.criterios.map(crit => `
                        <tr>
                            <td><strong>${crit.criterio}</strong></td>
                            <td>${crit.insuficiente}</td>
                            <td>${crit.basico}</td>
                            <td>${crit.proficiente}</td>
                            <td>${crit.avancado}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    planoContent.innerHTML = html;
}

// Função para mostrar erros
function mostrarErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Função para criar novo plano
function novoPlano() {
    formSection.style.display = 'block';
    resultSection.style.display = 'none';
    planoForm.reset();
    errorMessage.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para imprimir
function imprimir() {
    window.print();
}

// Função para copiar JSON
async function copiarJSON() {
    if (!ultimoPlanoGerado) return;

    try {
        const jsonText = JSON.stringify(ultimoPlanoGerado.plano, null, 2);
        await navigator.clipboard.writeText(jsonText);
        
        // Feedback visual
        const textoOriginal = copiarBtn.textContent;
        copiarBtn.textContent = '✓ Copiado!';
        copiarBtn.style.background = 'var(--secondary-color)';
        copiarBtn.style.color = 'white';
        
        setTimeout(() => {
            copiarBtn.textContent = textoOriginal;
            copiarBtn.style.background = '';
            copiarBtn.style.color = '';
        }, 2000);
    } catch (error) {
        alert('Erro ao copiar. Tente novamente.');
    }
}

// Verificar saúde da API ao carregar página
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('Status da API:', data);
        
        if (!data.gemini || !data.supabase) {
            console.warn('Configuração incompleta:', data);
        }
    } catch (error) {
        console.error('Erro ao verificar API:', error);
    }
});
