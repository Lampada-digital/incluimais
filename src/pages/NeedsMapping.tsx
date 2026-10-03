import React, { useState } from 'react';
import { useApp } from '../store';
import { EducationalNeed } from '../types';
import { Plus, Filter, BookOpen, MessageCircle, Brain, User, Users, X } from 'lucide-react';

const areas = [
  { value: 'aprendizagem', label: 'Aprendizagem', icon: BookOpen, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'comunicacao', label: 'Comunicação', icon: MessageCircle, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'comportamento', label: 'Comportamento e Emoções', icon: Brain, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'autonomia', label: 'Autonomia', icon: User, color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'social', label: 'Participação Social', icon: Users, color: 'bg-pink-50 text-pink-700 border-pink-200' },
];

const subAreas: Record<string, string[]> = {
  aprendizagem: ['Leitura', 'Escrita', 'Matemática', 'Interpretação', 'Memória', 'Atenção', 'Planejamento'],
  comunicacao: ['Comunicação verbal', 'Comunicação não verbal', 'Compreensão', 'Expressão', 'Comunicação alternativa'],
  comportamento: ['Regulação emocional', 'Flexibilidade', 'Tolerância à frustração', 'Interação', 'Adaptação às mudanças'],
  autonomia: ['Organização', 'Alimentação', 'Higiene', 'Deslocamento', 'Realização de tarefas'],
  social: ['Interação com colegas', 'Participação em grupos', 'Brincadeiras', 'Atividades coletivas'],
};

export default function NeedsMapping() {
  const { students, needs, addNeed } = useApp();
  const [filterStudent, setFilterStudent] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = needs.filter(n => {
    const matchStudent = !filterStudent || n.studentId === filterStudent;
    const matchArea = !filterArea || n.area === filterArea;
    return matchStudent && matchArea;
  });

  const getAreaInfo = (area: string) => areas.find(a => a.value === area);
  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Desconhecido';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapeamento de Necessidades</h1>
          <p className="text-gray-500 text-sm">Registre e acompanhe as necessidades educacionais observadas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Importante:</strong> Este registro documenta necessidades funcionais observadas. Não transforma observações em diagnósticos automáticos. 
          O foco é identificar estratégias pedagógicas adequadas para cada estudante.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none">
          <option value="">Todos os estudantes</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none">
          <option value="">Todas as áreas</option>
          {areas.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>

      {/* Area summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {areas.map(area => {
          const Icon = area.icon;
          const count = needs.filter(n => n.area === area.value).length;
          return (
            <div key={area.value} className={`${area.color} border rounded-xl p-3 text-center`}>
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-lg font-bold">{count}</p>
              <p className="text-xs">{area.label}</p>
            </div>
          );
        })}
      </div>

      {/* Records */}
      <div className="space-y-3">
        {filtered.map(need => {
          const areaInfo = getAreaInfo(need.area);
          const Icon = areaInfo?.icon || BookOpen;
          return (
            <div key={need.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${areaInfo?.color || 'bg-gray-100'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{need.subArea}</p>
                    <p className="text-xs text-gray-500">{getStudentName(need.studentId)} • {areaInfo?.label}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  need.frequency === 'sempre' ? 'bg-red-100 text-red-700' :
                  need.frequency === 'frequentemente' ? 'bg-amber-100 text-amber-700' :
                  need.frequency === 'as_vezes' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>{need.frequency}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Contexto</p>
                  <p className="text-gray-700">{need.context}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Resultado observado</p>
                  <p className="text-gray-700">{need.results}</p>
                </div>
              </div>
              {need.strategiesUsed.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1.5">Estratégias utilizadas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {need.strategiesUsed.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">{new Date(need.date).toLocaleDateString('pt-BR')}</p>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum registro encontrado</p>
        </div>
      )}

      {showForm && <NeedForm onClose={() => setShowForm(false)} onAdd={addNeed} students={students} />}
    </div>
  );
}

function NeedForm({ onClose, onAdd, students }: { onClose: () => void; onAdd: (n: EducationalNeed) => void; students: any[] }) {
  const [form, setForm] = useState({
    studentId: '', area: 'aprendizagem', subArea: '', frequency: 'as_vezes' as const,
    context: '', strategiesUsed: '', results: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.subArea) return;
    onAdd({
      id: `n_${Date.now()}`,
      studentId: form.studentId,
      area: form.area as any,
      subArea: form.subArea,
      frequency: form.frequency,
      context: form.context,
      strategiesUsed: form.strategiesUsed.split(',').map(s => s.trim()).filter(Boolean),
      results: form.results,
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Novo Registro de Necessidade</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estudante *</label>
            <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
              <option value="">Selecionar estudante</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área *</label>
            <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value, subArea: '' })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
              {areas.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subárea *</label>
            <select required value={form.subArea} onChange={e => setForm({ ...form, subArea: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
              <option value="">Selecionar</option>
              {(subAreas[form.area] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
            <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
              <option value="raramente">Raramente</option>
              <option value="as_vezes">Às vezes</option>
              <option value="frequentemente">Frequentemente</option>
              <option value="sempre">Sempre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contexto</label>
            <textarea value={form.context} onChange={e => setForm({ ...form, context: e.target.value })}
              placeholder="Em que contexto a dificuldade é observada?"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estratégias utilizadas (separadas por vírgula)</label>
            <input value={form.strategiesUsed} onChange={e => setForm({ ...form, strategiesUsed: e.target.value })}
              placeholder="Ex: Apoio visual, Timer"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resultados observados</label>
            <textarea value={form.results} onChange={e => setForm({ ...form, results: e.target.value })}
              placeholder="Qual foi o resultado das estratégias?"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={2} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
