import React, { useState } from 'react';
import { useApp } from '../store';
import { IndividualPlan, Goal } from '../types';
import { Plus, FileText, Target, Eye, Edit2, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

export default function Plans() {
  const { plans, students, addPlan } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [viewPlan, setViewPlan] = useState<IndividualPlan | null>(null);

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Desconhecido';

  const statusColors: Record<string, string> = {
    rascunho: 'bg-gray-100 text-gray-700',
    ativo: 'bg-green-100 text-green-700',
    revisao: 'bg-amber-100 text-amber-700',
    concluido: 'bg-blue-100 text-blue-700',
  };

  const statusLabels: Record<string, string> = {
    rascunho: 'Rascunho', ativo: 'Ativo', revisao: 'Em Revisão', concluido: 'Concluído'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos Individualizados (PEI)</h1>
          <p className="text-gray-500 text-sm">Planos Educacionais Individualizados para cada estudante</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Novo Plano
        </button>
      </div>

      {/* Plans list */}
      <div className="space-y-4">
        {plans.map(plan => {
          const student = students.find(s => s.id === plan.studentId);
          const totalGoals = [...plan.pedagogicalGoals, ...plan.autonomyGoals, ...plan.communicationGoals].length;
          const achievedGoals = [...plan.pedagogicalGoals, ...plan.autonomyGoals, ...plan.communicationGoals].filter(g => g.status === 'alancado').length;
          const progressPct = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

          return (
            <div key={plan.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                    <p className="text-sm text-gray-500">{getStudentName(plan.studentId)} • v{plan.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[plan.status]}`}>
                    {statusLabels[plan.status]}
                  </span>
                  <button onClick={() => setViewPlan(plan)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progresso geral</span>
                  <span className="font-medium text-gray-900">{progressPct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-700">{plan.pedagogicalGoals.length}</p>
                  <p className="text-xs text-blue-600">Pedagógicos</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-700">{plan.autonomyGoals.length}</p>
                  <p className="text-xs text-green-600">Autonomia</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-700">{plan.communicationGoals.length}</p>
                  <p className="text-xs text-purple-600">Comunicação</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span>Revisão: {new Date(plan.reviewDate).toLocaleDateString('pt-BR')}</span>
                <span>Responsáveis: {plan.responsible.join(', ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum plano criado ainda</p>
        </div>
      )}

      {/* View plan modal */}
      {viewPlan && <PlanView plan={viewPlan} onClose={() => setViewPlan(null)} getStudentName={getStudentName} />}
      {showForm && <PlanForm onClose={() => setShowForm(false)} onAdd={addPlan} students={students} />}
    </div>
  );
}

function PlanView({ plan, onClose, getStudentName }: { plan: IndividualPlan; onClose: () => void; getStudentName: (id: string) => string }) {
  const renderGoals = (goals: Goal[], color: string) => (
    <div className="space-y-2">
      {goals.map(goal => (
        <div key={goal.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
          {goal.status === 'alancado' ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> :
           goal.status === 'em_desenvolvimento' ? <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" /> :
           <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800">{goal.description}</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${goal.progress}%` }} />
            </div>
          </div>
          <span className="text-xs font-medium text-gray-500">{goal.progress}%</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">{plan.title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Estudante</p>
              <p className="font-medium text-gray-900">{getStudentName(plan.studentId)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="font-medium text-gray-900 capitalize">{plan.status}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Perfil Funcional</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{plan.functionalProfile}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Potencialidades</h4>
              <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">{plan.strengths}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Barreiras</h4>
              <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg">{plan.barriers}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" /> Objetivos Pedagógicos
            </h4>
            {renderGoals(plan.pedagogicalGoals, 'bg-blue-500')}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" /> Objetivos de Autonomia
            </h4>
            {renderGoals(plan.autonomyGoals, 'bg-green-500')}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" /> Objetivos de Comunicação
            </h4>
            {renderGoals(plan.communicationGoals, 'bg-purple-500')}
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Estratégias</h4>
            <div className="flex flex-wrap gap-2">
              {plan.strategies.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg">{s}</span>)}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recursos de Acessibilidade</h4>
            <div className="flex flex-wrap gap-2">
              {plan.accessibilityResources.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 bg-accent-50 text-accent-700 rounded-lg">{s}</span>)}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Adaptações Curriculares</h4>
            <div className="flex flex-wrap gap-2">
              {plan.curricularAdaptations.map((s, i) => <span key={i} className="text-xs px-3 py-1.5 bg-warm-50 text-warm-700 rounded-lg">{s}</span>)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Prazo</p>
              <p className="text-sm font-medium text-gray-900">{plan.deadlines}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Revisão</p>
              <p className="text-sm font-medium text-gray-900">{new Date(plan.reviewDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Versão</p>
              <p className="text-sm font-medium text-gray-900">v{plan.version}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">Responsáveis</p>
              <p className="text-sm font-medium text-gray-900">{plan.responsible.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanForm({ onClose, onAdd, students }: { onClose: () => void; onAdd: (p: IndividualPlan) => void; students: any[] }) {
  const [form, setForm] = useState({
    studentId: '', title: '', functionalProfile: '', strengths: '', barriers: '',
    pedagogicalGoals: '', autonomyGoals: '', communicationGoals: '',
    strategies: '', resources: '', adaptations: '', responsible: '', deadlines: '', reviewDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.title) return;
    const createGoals = (text: string): Goal[] => text.split('\n').filter(Boolean).map((desc, i) => ({
      id: `g_${Date.now()}_${i}`, description: desc, status: 'nao_iniciado' as const, progress: 0
    }));

    onAdd({
      id: `p_${Date.now()}`,
      studentId: form.studentId,
      title: form.title,
      functionalProfile: form.functionalProfile,
      strengths: form.strengths,
      barriers: form.barriers,
      pedagogicalGoals: createGoals(form.pedagogicalGoals),
      autonomyGoals: createGoals(form.autonomyGoals),
      communicationGoals: createGoals(form.communicationGoals),
      strategies: form.strategies.split(',').map(s => s.trim()).filter(Boolean),
      accessibilityResources: form.resources.split(',').map(s => s.trim()).filter(Boolean),
      curricularAdaptations: form.adaptations.split(',').map(s => s.trim()).filter(Boolean),
      responsible: form.responsible.split(',').map(s => s.trim()).filter(Boolean),
      deadlines: form.deadlines,
      evolutionIndicators: [],
      reviewDate: form.reviewDate,
      status: 'rascunho',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Novo Plano Individualizado</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estudante *</label>
            <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
              <option value="">Selecionar</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Plano *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: PEI - 1º Semestre 2024"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil Funcional</label>
            <textarea value={form.functionalProfile} onChange={e => setForm({ ...form, functionalProfile: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={2} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Potencialidades</label>
              <textarea value={form.strengths} onChange={e => setForm({ ...form, strengths: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barreiras</label>
              <textarea value={form.barriers} onChange={e => setForm({ ...form, barriers: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={2} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos Pedagógicos (um por linha)</label>
            <textarea value={form.pedagogicalGoals} onChange={e => setForm({ ...form, pedagogicalGoals: e.target.value })}
              placeholder="Ler textos curtos com apoio visual&#10;Resolver operações de adição"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos de Autonomia (um por linha)</label>
            <textarea value={form.autonomyGoals} onChange={e => setForm({ ...form, autonomyGoals: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos de Comunicação (um por linha)</label>
            <textarea value={form.communicationGoals} onChange={e => setForm({ ...form, communicationGoals: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estratégias (separadas por vírgula)</label>
            <input value={form.strategies} onChange={e => setForm({ ...form, strategies: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recursos de Acessibilidade (separados por vírgula)</label>
            <input value={form.resources} onChange={e => setForm({ ...form, resources: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adaptações Curriculares (separadas por vírgula)</label>
            <input value={form.adaptations} onChange={e => setForm({ ...form, adaptations: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsáveis</label>
              <input value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
              <input value={form.deadlines} onChange={e => setForm({ ...form, deadlines: e.target.value })}
                placeholder="Junho 2024"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Revisão</label>
              <input type="date" value={form.reviewDate} onChange={e => setForm({ ...form, reviewDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">Criar Plano</button>
          </div>
        </form>
      </div>
    </div>
  );
}
