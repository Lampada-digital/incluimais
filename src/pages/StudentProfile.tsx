import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { ArrowLeft, Calendar, School, Phone, Mail, Brain, Heart, Target, MessageSquare, Shield } from 'lucide-react';

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, needs, plans, progress, classrooms } = useApp();

  const student = students.find(s => s.id === id);
  if (!student) return <div className="text-center py-12 text-gray-500">Estudante não encontrado</div>;

  const calcAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const studentNeeds = needs.filter(n => n.studentId === id);
  const studentPlans = plans.filter(p => p.studentId === id);
  const studentProgress = progress.filter(p => p.studentId === id);
  const classroom = classrooms.find(c => c.id === student.classroomId);

  const autonomyColors = { baixo: 'bg-red-100 text-red-700', medio: 'bg-amber-100 text-amber-700', alto: 'bg-green-100 text-green-700' };
  const autonomyLabels = { baixo: 'Baixo', medio: 'Médio', alto: 'Alto' };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button onClick={() => navigate('/students')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Voltar para estudantes
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{student.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {calcAge(student.birthDate)} anos</span>
              <span className="flex items-center gap-1"><School className="w-4 h-4" /> {classroom?.name}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${autonomyColors[student.autonomyLevel]}`}>
                Autonomia: {autonomyLabels[student.autonomyLevel]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Diagnoses */}
          {student.diagnoses.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary-500" /> Diagnósticos Informados
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.diagnoses.map((d, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">{d}</span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">* Informações clínicas de acesso restrito, separadas de dados pedagógicos.</p>
            </div>
          )}

          {/* Strengths & Interests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" /> Potencialidades
              </h3>
              <ul className="space-y-2">
                {student.strengths.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-accent-400 rounded-full" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" /> Interesses
              </h3>
              <ul className="space-y-2">
                {student.interests.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-warm-400 rounded-full" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Needs mapping summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" /> Necessidades Mapeadas
            </h3>
            {studentNeeds.length > 0 ? (
              <div className="space-y-3">
                {studentNeeds.map(need => (
                  <div key={need.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{need.subArea}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        need.frequency === 'sempre' ? 'bg-red-100 text-red-700' :
                        need.frequency === 'frequentemente' ? 'bg-amber-100 text-amber-700' :
                        need.frequency === 'as_vezes' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{need.frequency}</span>
                    </div>
                    <p className="text-xs text-gray-500">{need.context}</p>
                    <p className="text-xs text-gray-600 mt-1">Resultado: {need.results}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma necessidade mapeada ainda.</p>
            )}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" /> Registros de Evolução
            </h3>
            {studentProgress.length > 0 ? (
              <div className="space-y-3">
                {studentProgress.slice().reverse().map(rec => (
                  <div key={rec.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{rec.area}</span>
                      <span className="text-xs text-gray-400">{new Date(rec.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-sm text-gray-700">{rec.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rec.achieved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {rec.achieved ? '✓ Alcançado' : '↗ Em progresso'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum registro de evolução.</p>
            )}
          </div>
        </div>

        {/* Right column - Details */}
        <div className="space-y-6">
          {/* Communication */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" /> Comunicação
            </h3>
            <p className="text-sm text-gray-700">{student.communicationForm || 'Não informado'}</p>
          </div>

          {/* Sensory needs */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Necessidades Sensoriais</h3>
            {student.sensoryNeeds.length > 0 ? (
              <ul className="space-y-1.5">
                {student.sensoryNeeds.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" /> {s}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500">Não informado</p>}
          </div>

          {/* Support needs */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Necessidades de Apoio</h3>
            {student.supportNeeds.length > 0 ? (
              <ul className="space-y-1.5">
                {student.supportNeeds.map((s, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> {s}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500">Não informado</p>}
          </div>

          {/* Guardians */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Responsáveis</h3>
            {student.guardians.length > 0 ? (
              <div className="space-y-3">
                {student.guardians.map(g => (
                  <div key={g.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{g.name}</p>
                    <p className="text-xs text-gray-500">{g.relationship}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {g.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <Mail className="w-3 h-3" /> {g.email}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">Nenhum responsável cadastrado</p>}
          </div>

          {/* Active plans */}
          {studentPlans.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Planos Ativos</h3>
              {studentPlans.map(plan => (
                <div key={plan.id} className="p-3 bg-primary-50 rounded-lg mb-2">
                  <p className="text-sm font-medium text-primary-800">{plan.title}</p>
                  <p className="text-xs text-primary-600 mt-1">Revisão: {new Date(plan.reviewDate).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
