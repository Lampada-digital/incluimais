import React, { useState } from 'react';
import { useApp } from '../store';
import { BookOpen, Search, Star, Filter, Heart, ChevronDown, ChevronUp } from 'lucide-react';

export default function Strategies() {
  const { strategies, toggleStrategyFavorite } = useApp();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterNeeds, setFilterNeeds] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const categories = [...new Set(strategies.map(s => s.category))];
  const allNeeds = [...new Set(strategies.flatMap(s => s.needs))];

  const filtered = strategies.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || s.category === filterCategory;
    const matchNeeds = !filterNeeds || s.needs.includes(filterNeeds);
    const matchFav = !showFavorites || s.favorite;
    return matchSearch && matchCategory && matchNeeds && matchFav;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Estratégias Pedagógicas</h1>
        <p className="text-gray-500 text-sm">Estratégias organizadas por necessidade, disciplina e objetivo</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar estratégia..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
          <option value="">Todas categorias</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterNeeds} onChange={e => setFilterNeeds(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
          <option value="">Todas necessidades</option>
          {allNeeds.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFavorites ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <Star className={`w-4 h-4 inline mr-1 ${showFavorites ? 'fill-amber-400' : ''}`} /> Favoritas
        </button>
      </div>

      {/* Strategies */}
      <div className="space-y-3">
        {filtered.map(strategy => (
          <div key={strategy.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{strategy.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{strategy.category}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{strategy.subject}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{strategy.ageRange}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => toggleStrategyFavorite(strategy.id)}
                  className={`p-2 rounded-lg transition-colors ${strategy.favorite ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'}`}>
                  <Star className={`w-5 h-5 ${strategy.favorite ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {strategy.needs.map((n, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">{n}</span>
                ))}
              </div>

              <button onClick={() => setExpandedId(expandedId === strategy.id ? null : strategy.id)}
                className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700">
                {expandedId === strategy.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {expandedId === strategy.id ? 'Ocultar detalhes' : 'Ver detalhes'}
              </button>
            </div>

            {expandedId === strategy.id && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4 bg-gray-50/50">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Objetivo</p>
                  <p className="text-sm text-gray-700">{strategy.objective}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Habilidades desenvolvidas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.skills.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-accent-50 text-accent-700 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Recursos necessários</p>
                  <p className="text-sm text-gray-700">{strategy.resources}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Como aplicar</p>
                  <ol className="space-y-1.5">
                    {strategy.steps.map((step, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma estratégia encontrada</p>
        </div>
      )}
    </div>
  );
}
