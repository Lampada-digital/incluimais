import React, { useState } from 'react';
import { useApp } from '../store';
import { BarChart3, Download, FileText, Filter, Plus, Eye, X } from 'lucide-react';

export default function Reports() {
  const { students, reports, plans, progress, addReport } = useApp();
  const [filterType, setFilterType] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);
  const [viewReport, setViewReport] = useState<any>(null);

  const filtered = reports.filter(r => !filterType || r.type === filterType);

  const typeLabels: Record<string, string> = {
    individual: 'Individual', pedagogico: 'Pedagógico', pei: 'PEI',
    evolucao: 'Evolução', participacao: 'Participação', familia: 'Família',
    turma: 'Turma', institucional: 'Institucional'
  };

  const typeColors: Record<string, string> = {
    individual: 'bg-blue-50 text-blue-700', pedagogico: 'bg-green-50 text-green-700',
    pei: 'bg-purple-50 text-purple-700', evolucao: 'bg-amber-50 text-amber-700',
    participacao: 'bg-pink-50 text-pink-700', familia: 'bg-cyan-50 text-cyan-700',
    turma: 'bg-indigo-50 text-indigo-700', institucional: 'bg-gray-100 text-gray-700'
  };

  const generateReport = (type: string, studentId?: string) => {
    const student = students.find(s => s.id === studentId);
    const studentProgress = progress.filter(p => p.studentId === studentId);
    const studentPlan = plans.find(p => p.studentId === studentId);

    let content = '';
    let title = '';

    switch (type) {
      case 'individual':
        title = `Relatório Individual — ${student?.name}`;
        content = `RELATÓRIO INDIVIDUAL DO ESTUDANTE\n\nEstudante: ${student?.name}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n1. PERFIL\n${student?.strengths.join(', ')}\n\n2. NECESSIDADES DE APOIO\n${student?.supportNeeds.join(', ')}\n\n3. FORMA DE COMUNICAÇÃO\n${student?.communicationForm}\n\n4. NÍVEL DE AUTONOMIA\n${student?.autonomyLevel}\n\n5. OBSERVAÇÕES PEDAGÓGICAS\n${student?.observations.join('\n') || 'Sem observações registradas'}`;
        break;
      case 'evolucao':
        title = `Relatório de Evolução — ${student?.name}`;
        content = `RELATÓRIO DE EVOLUÇÃO\n\nEstudante: ${student?.name}\nPeríodo: Últimos registros\n\nREGISTROS:\n${studentProgress.map(p => `• ${p.date}: ${p.description} (${p.achieved ? 'Alcançado' : 'Em progresso'})`).join('\n')}\n\nTAXA DE EVOLUÇÃO: ${studentProgress.length > 0 ? Math.round((studentProgress.filter(p => p.achieved).length / studentProgress.length) * 100) : 0}%`;
        break;
      case 'pei':
        title = `Relatório PEI — ${student?.name}`;
        content = `RELATÓRIO DO PLANO EDUCACIONAL INDIVIDUALIZADO\n\nEstudante: ${student?.name}\nPlano: ${studentPlan?.title}\n\nOBJETIVOS PEDAGÓGICOS:\n${studentPlan?.pedagogicalGoals.map(g => `• ${g.description} — ${g.progress}%`).join('\n')}\n\nOBJETIVOS DE AUTONOMIA:\n${studentPlan?.autonomyGoals.map(g => `• ${g.description} — ${g.progress}%`).join('\n')}\n\nESTRATÉGIAS:\n${studentPlan?.strategies.join('\n• ')}`;
        break;
      default:
        title = `Relatório — ${new Date().toLocaleDateString('pt-BR')}`;
        content = 'Relatório gerado pela plataforma INCLUI+';
    }

    const report = {
      id: `r_${Date.now()}`,
      studentId,
      type: type as any,
      title,
      content,
      generatedBy: 'Usuário',
      date: new Date().toISOString().split('T')[0]
    };
    addReport(report);
    setViewReport(report);
    setShowGenerate(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Inteligentes</h1>
          <p className="text-gray-500 text-sm">Gere relatórios individuais, pedagógicos e institucionais</p>
        </div>
        <button onClick={() => setShowGenerate(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Gerar Relatório
        </button>
      </div>

      {/* Filter */}
      <select value={filterType} onChange={e => setFilterType(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
        <option value="">Todos os tipos</option>
        {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.map(report => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{report.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[report.type] || 'bg-gray-100 text-gray-700'}`}>
                    {typeLabels[report.type] || report.type}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                  <span className="text-xs text-gray-400">• {report.generatedBy}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewReport(report)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum relatório gerado</p>
        </div>
      )}

      {/* Generate modal */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Gerar Relatório</h2>
              <button onClick={() => setShowGenerate(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de relatório</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <button key={key} onClick={() => generateReport(key, students[0]?.id)}
                      className={`p-3 rounded-xl border text-left text-sm hover:border-primary-300 hover:bg-primary-50 transition-all ${typeColors[key]}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estudante (para relatórios individuais)</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View report modal */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-900">{viewReport.title}</h2>
              <button onClick={() => setViewReport(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{viewReport.content}</pre>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" /> Exportar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
