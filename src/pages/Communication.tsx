import React, { useState } from 'react';
import { useApp } from '../store';
import { Heart, Plus, X, Grid3X3, List } from 'lucide-react';

export default function Communication() {
  const { students, cards } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [view, setView] = useState<'cards' | 'routine' | 'emotions'>('cards');
  const [showAdd, setShowAdd] = useState(false);

  const studentCards = cards.filter(c => c.studentId === selectedStudent);
  const routineCards = studentCards.filter(c => c.type === 'rotina').sort((a, b) => a.order - b.order);
  const emotionCards = studentCards.filter(c => c.type === 'emocao');
  const needCards = studentCards.filter(c => c.type === 'necessidade');
  const choiceCards = studentCards.filter(c => c.type === 'escolha');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comunicação Alternativa</h1>
          <p className="text-gray-500 text-sm">Cartões, pictogramas e rotinas visuais personalizadas</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Novo Cartão
        </button>
      </div>

      {/* Student selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none">
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div className="flex gap-2">
          <button onClick={() => setView('cards')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'cards' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <Grid3X3 className="w-4 h-4 inline mr-1" /> Cartões
          </button>
          <button onClick={() => setView('routine')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'routine' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <List className="w-4 h-4 inline mr-1" /> Rotina
          </button>
          <button onClick={() => setView('emotions')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'emotions' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <Heart className="w-4 h-4 inline mr-1" /> Emoções
          </button>
        </div>
      </div>

      {/* Communication Cards View */}
      {view === 'cards' && (
        <div className="space-y-6">
          {/* Need cards */}
          {needCards.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">📢 Expressar Necessidades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {needCards.map(card => (
                  <button key={card.id} className="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 p-3 hover:scale-105 transition-transform shadow-sm active:scale-95"
                    style={{ backgroundColor: card.color + '15', borderColor: card.color }}>
                    <span className="text-4xl">{card.symbol}</span>
                    <span className="text-xs font-medium text-center" style={{ color: card.color }}>{card.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Choice cards */}
          {choiceCards.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">🎯 Fazer Escolhas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {choiceCards.map(card => (
                  <button key={card.id} className="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 p-3 hover:scale-105 transition-transform shadow-sm active:scale-95"
                    style={{ backgroundColor: card.color + '15', borderColor: card.color }}>
                    <span className="text-4xl">{card.symbol}</span>
                    <span className="text-xs font-medium text-center" style={{ color: card.color }}>{card.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All cards */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">🗂️ Todos os Cartões</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {studentCards.map(card => (
                <button key={card.id} className="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 p-3 hover:scale-105 transition-transform shadow-sm active:scale-95"
                  style={{ backgroundColor: card.color + '15', borderColor: card.color }}>
                  <span className="text-4xl">{card.symbol}</span>
                  <span className="text-xs font-medium text-center" style={{ color: card.color }}>{card.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Routine View */}
      {view === 'routine' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📅 Rotina Visual do Dia</h3>
          {routineCards.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-wrap gap-4">
                {routineCards.map((card, i) => (
                  <div key={card.id} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1"
                        style={{ backgroundColor: card.color + '15', borderColor: card.color }}>
                        <span className="text-3xl">{card.symbol}</span>
                        <span className="text-[10px] font-medium" style={{ color: card.color }}>{card.title}</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{i + 1}º</span>
                    </div>
                    {i < routineCards.length - 1 && (
                      <span className="text-gray-300 text-2xl">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">Nenhuma rotina cadastrada para este estudante</p>
            </div>
          )}
        </div>
      )}

      {/* Emotions View */}
      {view === 'emotions' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">😊 Como estou me sentindo?</h3>
          {emotionCards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {emotionCards.map(card => (
                <button key={card.id} className="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-3 p-4 hover:scale-105 transition-transform shadow-sm active:scale-95"
                  style={{ backgroundColor: card.color + '15', borderColor: card.color }}>
                  <span className="text-5xl">{card.symbol}</span>
                  <span className="text-sm font-medium" style={{ color: card.color }}>{card.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">Nenhum cartão de emoção cadastrado</p>
            </div>
          )}
        </div>
      )}

      {showAdd && <AddCardModal onClose={() => setShowAdd(false)} studentId={selectedStudent} />}
    </div>
  );
}

function AddCardModal({ onClose, studentId }: { onClose: () => void; studentId: string }) {
  const emojis = ['😊', '😢', '😠', '😰', '😴', '🤔', '🙋', '⏸️', '🔇', '🚻', '🍎', '💧', '📖', '🔢', '🎨', '🎮', '🦕', '🌟', '❤️', '👍'];
  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
  const [form, setForm] = useState({ title: '', symbol: '😊', color: '#3b82f6', type: 'necessidade' as const });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Novo Cartão de Comunicação</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
              <option value="necessidade">Necessidade</option>
              <option value="emocao">Emoção</option>
              <option value="escolha">Escolha</option>
              <option value="rotina">Rotina</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Preciso de ajuda"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Símbolo</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map(e => (
                <button key={e} onClick={() => setForm({ ...form, symbol: e })}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${form.symbol === e ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => (
                <button key={c} onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          {/* Preview */}
          <div className="flex justify-center pt-2">
            <div className="w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-1"
              style={{ backgroundColor: form.color + '15', borderColor: form.color }}>
              <span className="text-3xl">{form.symbol}</span>
              <span className="text-[10px] font-medium text-center px-1" style={{ color: form.color }}>{form.title || 'Título'}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancelar</button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">Criar Cartão</button>
          </div>
        </div>
      </div>
    </div>
  );
}
