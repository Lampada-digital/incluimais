import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Student } from '../types';
import { Plus, Search, Filter, User, Calendar, School, Eye, Edit2, Trash2, X } from 'lucide-react';

export default function Students() {
  const { students, addStudent, deleteStudent, classrooms } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterClass, setFilterClass] = useState('');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchClass = !filterClass || s.classroomId === filterClass;
    return matchSearch && matchClass;
  });

  const calcAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudantes</h1>
          <p className="text-gray-500 text-sm">{students.length} estudantes cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Estudante
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
          />
        </div>
        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none"
        >
          <option value="">Todas as turmas</option>
          {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Student cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(student => (
          <div key={student.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-700">{student.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-xs text-gray-500">{calcAge(student.birthDate)} anos • {student.year}</p>
                </div>
              </div>
            </div>

            {student.diagnoses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {student.diagnoses.map((d, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">{d}</span>
                ))}
              </div>
            )}

            <div className="space-y-1.5 text-sm text-gray-600 mb-4">
              <p className="flex items-center gap-2">
                <School className="w-3.5 h-3.5 text-gray-400" />
                {classrooms.find(c => c.id === student.classroomId)?.name || 'Sem turma'}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {student.communicationForm}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => navigate(`/students/${student.id}`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Perfil
              </button>
              <button
                onClick={() => navigate(`/needs?student=${student.id}`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent-50 text-accent-700 text-sm font-medium hover:bg-accent-100 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Necessidades
              </button>
              <button
                onClick={() => { if (confirm('Remover estudante?')) deleteStudent(student.id); }}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum estudante encontrado</p>
        </div>
      )}

      {/* New Student Modal */}
      {showForm && <StudentForm onClose={() => setShowForm(false)} onAdd={addStudent} />}
    </div>
  );
}

function StudentForm({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Student) => void }) {
  const { classrooms } = useApp();
  const [form, setForm] = useState({
    name: '', birthDate: '', classroomId: '', year: '',
    diagnoses: '', strengths: '', interests: '', communicationForm: '',
    sensoryNeeds: '', autonomyLevel: 'medio' as const, supportNeeds: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.birthDate) return;
    const classroom = classrooms.find(c => c.id === form.classroomId);
    onAdd({
      id: `st_${Date.now()}`,
      name: form.name,
      birthDate: form.birthDate,
      schoolId: 's1',
      classroomId: form.classroomId,
      year: classroom?.year || form.year,
      guardians: [],
      diagnoses: form.diagnoses.split(',').map(d => d.trim()).filter(Boolean),
      supportLevels: [],
      strengths: form.strengths.split(',').map(s => s.trim()).filter(Boolean),
      interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
      communicationForm: form.communicationForm,
      sensoryNeeds: form.sensoryNeeds.split(',').map(s => s.trim()).filter(Boolean),
      autonomyLevel: form.autonomyLevel,
      supportNeeds: form.supportNeeds.split(',').map(s => s.trim()).filter(Boolean),
      observations: [],
      documents: [],
      createdAt: new Date().toISOString().split('T')[0],
      active: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Novo Estudante</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento *</label>
              <input required type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
              <select value={form.classroomId} onChange={e => setForm({ ...form, classroomId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
                <option value="">Selecionar turma</option>
                {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnósticos (separados por vírgula)</label>
              <input value={form.diagnoses} onChange={e => setForm({ ...form, diagnoses: e.target.value })}
                placeholder="Ex: TEA - Nível 1, TDAH"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Potencialidades (separadas por vírgula)</label>
              <input value={form.strengths} onChange={e => setForm({ ...form, strengths: e.target.value })}
                placeholder="Ex: Memória visual, Criatividade"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Interesses (separados por vírgula)</label>
              <input value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })}
                placeholder="Ex: Dinossauros, Música"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forma de comunicação</label>
              <input value={form.communicationForm} onChange={e => setForm({ ...form, communicationForm: e.target.value })}
                placeholder="Ex: Verbal, CAA, Gestos"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível de autonomia</label>
              <select value={form.autonomyLevel} onChange={e => setForm({ ...form, autonomyLevel: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm">
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Necessidades sensoriais (separadas por vírgula)</label>
              <input value={form.sensoryNeeds} onChange={e => setForm({ ...form, sensoryNeeds: e.target.value })}
                placeholder="Ex: Sensibilidade a sons, Prefere ambientes organizados"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Necessidades de apoio (separadas por vírgula)</label>
              <input value={form.supportNeeds} onChange={e => setForm({ ...form, supportNeeds: e.target.value })}
                placeholder="Ex: Rotina visual, Tempo adicional"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
