import React, { useState } from 'react';
import { FileText, Wand2, Download, BookOpen, Target, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function Activities() {
  const [form, setForm] = useState({
    subject: '', year: '', content: '', objective: '', difficulty: '',
    adaptationType: '', questions: '5', complexity: 'medio', format: ''
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        original: `### Atividade Original — ${form.subject || 'Matemática'}\n\n**Conteúdo:** ${form.content || 'Operações de adição e subtração'}\n**Ano:** ${form.year || '4º ano'}\n\n1. Resolva: 234 + 156 = ___\n2. Resolva: 478 + 329 = ___\n3. Resolva: 567 - 234 = ___\n4. Resolva: 891 - 456 = ___\n5. Resolva: 345 + 278 = ___`,
        adapted: `### Atividade Adaptada\n\n**Adaptações aplicadas:**\n- Instruções simplificadas e fragmentadas\n- Apoio visual com representação concreta\n- Etapas progressivas\n- Fonte ampliada e espaçamento\n\n---\n\n**🔢 Vamos somar!**\n\n**Questão 1:**\n📦📦📦 = 234\n📦📦 = 156\n\nPasso 1: Some as unidades (4 + 6 = ___)\nPasso 2: Some as dezenas (3 + 5 = ___)\nPasso 3: Some as centenas (2 + 1 = ___)\n\n**Resposta:** ___\n\n---\n\n**Questão 2:**\nUse o material dourado para ajudar!\n\n478 + 329 = ?\n\n💡 Dica: Comece pelas unidades!`,
        instructions: `### Instruções Simplificadas para o Estudante\n\n1. 📖 Leia a questão com calma\n2. 🔢 Use o material dourado se precisar\n3. ✏️ Resolva passo a passo\n4. ✅ Confira sua resposta\n5. 🙋 Se precisar de ajuda, levante a mão`,
        teacherGuide: `### Orientações ao Professor\n\n**Antes da atividade:**\n- Verifique se o estudante compreendeu as instruções\n- Tenha material concreto disponível (material dourado, ábaco)\n- Apresente a atividade em etapas\n\n**Durante a atividade:**\n- Observe se o estudante está seguindo as etapas\n- Ofereça mediação quando necessário\n- Permita tempo adicional\n- Valorize o processo, não apenas o resultado\n\n**Avaliação:**\n- ✓ Acertou o processo mesmo com erro no cálculo\n- ✓ Usou material de apoio com autonomia\n- ✓ Conseguiu resolver com mediação parcial\n- ✓ Demonstrou compreensão do conceito`,
        criteria: `### Critérios de Avaliação Adaptados\n\n| Critério | Não alcançado | Em desenvolvimento | Alcançado |\n|----------|--------------|-------------------|----------|\n| Compreensão da operação | Não identifica a operação | Identifica com apoio | Identifica com autonomia |\n| Uso de material concreto | Não utiliza | Utiliza com mediação | Utiliza com autonomia |\n| Resolução por etapas | Não segue etapas | Segue com apoio | Segue com autonomia |\n| Registro da resposta | Não registra | Registra com apoio | Registra com autonomia |\n\n**Formas alternativas de resposta:**\n- Oral (dizer o resultado)\n- Apontar para a resposta correta\n- Usar material concreto para demonstrar\n- Desenhar a resolução`,
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Adaptador de Atividades</h1>
        <p className="text-gray-500 text-sm">Transforme atividades tradicionais em versões acessíveis com apoio da IA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary-500" /> Configurar Adaptação
          </h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none">
                  <option value="">Selecionar</option>
                  <option>Matemática</option><option>Português</option><option>Ciências</option>
                  <option>História</option><option>Geografia</option><option>Artes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano escolar</label>
                <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none">
                  <option value="">Selecionar</option>
                  <option>1º ano</option><option>2º ano</option><option>3º ano</option>
                  <option>4º ano</option><option>5º ano</option><option>6º ano</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
              <input value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Ex: Operações de adição com reserva"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo de aprendizagem</label>
              <input value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })}
                placeholder="Ex: Resolver adições com números de 3 algarismos"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade observada</label>
              <input value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}
                placeholder="Ex: Não consegue alinhar as colunas"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de adaptação</label>
                <select value={form.adaptationType} onChange={e => setForm({ ...form, adaptationType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none">
                  <option value="">Selecionar</option>
                  <option>Instruções simplificadas</option><option>Apoio visual</option>
                  <option>Fragmentação de etapas</option><option>Material concreto</option>
                  <option>Tempo adicional</option><option>Formato alternativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de questões</label>
                <input type="number" min="1" max="20" value={form.questions}
                  onChange={e => setForm({ ...form, questions: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 outline-none" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Gerando...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Gerar Atividade Adaptada</>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" /> Atividade Adaptada
                </h4>
                <div className="prose prose-sm max-w-none">
                  {result.adapted.split('\n').map((line: string, i: number) => {
                    if (line.startsWith('### ')) return <h5 key={i} className="font-bold text-gray-900 mt-3">{line.replace('### ', '')}</h5>;
                    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-gray-800 mt-2">{line.replace(/\*\*/g, '')}</p>;
                    if (line.startsWith('---')) return <hr key={i} className="my-3" />;
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="text-sm text-gray-700">{line}</p>;
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" /> Instruções Simplificadas
                </h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {result.instructions.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                    <p key={i}>{line.replace(/^#+\s*/, '')}</p>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Orientações ao Professor
                </h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {result.teacherGuide.split('\n').filter((l: string) => l.trim() && !l.startsWith('###')).map((line: string, i: number) => (
                    <p key={i}>{line.replace(/^\*\*|\*\*$/g, '').replace(/^- /, '• ')}</p>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Critérios de Avaliação</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  {result.criteria.split('\n').filter((l: string) => l.trim() && !l.startsWith('###') && !l.startsWith('|')).map((line: string, i: number) => (
                    <p key={i}>{line.replace(/^\*\*|\*\*$/g, '').replace(/^- /, '• ')}</p>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm h-full flex flex-col items-center justify-center">
              <Wand2 className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Preencha o formulário ao lado para gerar uma atividade adaptada</p>
              <p className="text-xs text-gray-400 mt-2">A IA criará versões acessíveis com instruções simplificadas e apoios visuais</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
