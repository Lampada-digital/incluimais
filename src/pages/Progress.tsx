import React, { useState } from 'react';
import { useApp } from '../store';
import { ProgressRecord } from '../types';
import { Plus, TrendingUp, Filter, X, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Progress() {
  const { students, progress, addProgress } = useApp();
  const [filterStudent, setFilterStudent] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = progress.filter(p => {
    const matchStudent = !filterStudent || p.studentId === filterStudent;
    const matchArea = !filterArea || p.area === filterArea;
    return matchStudent && matchArea;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Desconhecido';

  // Chart data - progress over time per student
  const chartData = filtered.slice(0, 10).reverse().map(p => ({
    date: new Date(p.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    area: p.area,
    achieved: p.achieved ? 1 : 0,
  }));

  const areaStats = ['Pedagógico', 'Comunicação', 'Social', 'Autonomia', 'Comportamento'].map(area => ({
    area,
    total: filtered.filter(p => p.area === area).length,
    achieved: filtered.filter(p => p.area === area && p.achieved).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acompanhamento da Evolução</h1>
          <p className="text-gray-500 text-sm">Registros de desenvolvimento individual — sem comparações competitivas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{filtered.length}</p>
          <p className="text-xs text-gray-500">Total de registros</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{filtered.filter(p => p.achieved).length}</p>
          <p className="text-xs text-gray-500">Objetivos alcançados</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{filtered.filter(p => !p.achieved).length}</p>
          <p className="text-xs text-gray-500">Em desenvolvimento</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{filtered.length > 0 ? Math.round((filtered.filter(p => p.achieved).length / filtered.length) * 100) : 0}%</p>
          <p className="text-xs text-gray-500">Taxa de evolução</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Evolução por Área</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={areaStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="area" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="achieved" fill="#22c55e" name="Alcançados" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="#e2e8f0" name="Total" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Registros Recentes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 1]} ticks={[0, 1]} tickFormatter={(v) => v === 1 ? '✓' : '○'} />
              <Tooltip />
              <Line type="monotone" dataKey="achieved" stroke="#0c8ce9" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
          <option value="">Todos os estudantes</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
          <option value="">Todas as áreas</option>
          <option>Pedagógico</option><option>Comunicação</option><option>Social</option>
          <option>Autonomia</option><option>Comportamento</option>
        </select>
      </div>

      {/* Records */}
      <div className="space-y-3">
        {filtered.map(record => (
          <div key={record.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                {record.achieved ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{getStudentName(record.studentId)}</p>
                  <p className="text-xs text-gray-500">{record.area} • {new Date(record.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${record.achieved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {record.achieved ? 'Alcançado' : 'Em progresso'}
              </span>
            </div>
            <p className="text-sm text-gray-700 ml-8">{record.description}</p>
            {record.strategies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                {record.strategies.map((s, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg">{s}</span>
                ))}
              </div>
            )}
            {record.notes && <p className="text-xs text-gray-500 mt-2 ml-8 italic">{record.notes}</p>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum registro de evolução encontrado</p>
        </div>
      )}

      {showForm && <ProgressForm onClose={() => setShowForm(false)} onAdd={addProgress} students={students} />}
    </div>
  );
}

function ProgressForm({ onClose, onAdd, students }: { onClose: () => void; onAdd: (r: ProgressRecord) => void; students: any[] }) {
  const [form, setForm] = useState({
    studentId: '', area: 'Pedagógico', description: '', achieved: false, strategies: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.description) return;
    onAdd({
      id: `pr_${Date.now()}`,
      studentId: form.studentId,
      date: new Date().toISOString().split('T')[0],
      area: form.area,
      description: form.description,
      achieved: form.achieved,
      strategies: form.strategies.split(',').map(s => s.trim()).filter(Boolean),
      notes: form.notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Novo Registro de Evolução</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
            <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
              <option>Pedagógico</option><option>Comunicação</option><option>Social</option>
              <option>Autonomia</option><option>Comportamento</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="O que o estudante conseguiu realizar?"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" rows={3} />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.achieved} onChange={e => setForm({ ...form, achieved: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-700">Objetivo alcançado</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estratégias utilizadas (separadas por vírgula)</label>
            <input value={form.strategies} onChange={e => setForm({ ...form, strategies: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
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
