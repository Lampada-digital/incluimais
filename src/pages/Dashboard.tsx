import React from 'react';
import { useApp } from '../store';
import { Users, Target, FileText, TrendingUp, AlertCircle, Calendar, BookOpen, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { students, plans, progress, needs, reports } = useApp();

  const activePlans = plans.filter(p => p.status === 'ativo').length;
  const totalProgress = progress.length;
  const studentsNeedingAttention = students.filter(s => {
    const studentNeeds = needs.filter(n => n.studentId === s.id && n.frequency === 'sempre');
    return studentNeeds.length > 0;
  }).length;

  const plansNeedingReview = plans.filter(p => {
    const reviewDate = new Date(p.reviewDate);
    const now = new Date();
    const diff = (reviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 30 && diff > 0;
  }).length;

  const stats = [
    { label: 'Estudantes Cadastrados', value: students.length, icon: Users, color: 'bg-primary-500', bgLight: 'bg-primary-50' },
    { label: 'Planos Ativos', value: activePlans, icon: Target, color: 'bg-accent-500', bgLight: 'bg-accent-50' },
    { label: 'Registros de Evolução', value: totalProgress, icon: TrendingUp, color: 'bg-purple-500', bgLight: 'bg-purple-50' },
    { label: 'Relatórios Gerados', value: reports.length, icon: FileText, color: 'bg-warm-500', bgLight: 'bg-warm-50' },
  ];

  const alerts = [
    { label: 'Estudantes com necessidade de acompanhamento', value: studentsNeedingAttention, icon: AlertCircle, color: 'text-red-600 bg-red-50' },
    { label: 'Planos próximos da revisão', value: plansNeedingReview, icon: Calendar, color: 'text-amber-600 bg-amber-50' },
  ];

  // Chart data
  const areaData = [
    { name: 'Pedagógico', value: progress.filter(p => p.area === 'Pedagógico').length },
    { name: 'Comunicação', value: progress.filter(p => p.area === 'Comunicação').length },
    { name: 'Social', value: progress.filter(p => p.area === 'Social').length },
    { name: 'Autonomia', value: progress.filter(p => p.area === 'Autonomia').length },
    { name: 'Comportamento', value: progress.filter(p => p.area === 'Comportamento').length },
  ];

  const needAreas = [
    { name: 'Aprendizagem', value: needs.filter(n => n.area === 'aprendizagem').length },
    { name: 'Comunicação', value: needs.filter(n => n.area === 'comunicacao').length },
    { name: 'Comportamento', value: needs.filter(n => n.area === 'comportamento').length },
    { name: 'Autonomia', value: needs.filter(n => n.area === 'autonomia').length },
    { name: 'Social', value: needs.filter(n => n.area === 'social').length },
  ];

  const COLORS = ['#0c8ce9', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444'];

  const recentActivity = progress.slice(-5).reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Bom dia! 👋</h1>
        <p className="text-primary-100 mt-1">Aqui está um resumo da sua plataforma INCLUI+ hoje.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {alerts.map((alert, i) => {
          const Icon = alert.icon;
          return (
            <div key={i} className={`${alert.color} rounded-xl p-4 flex items-center gap-4`}>
              <Icon className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold text-lg">{alert.value}</p>
                <p className="text-sm opacity-80">{alert.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registros por Área</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0c8ce9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Necessidades Mapeadas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={needAreas} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {needAreas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Atividade Recente
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActivity.map(record => (
            <div key={record.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${record.achieved ? 'bg-green-500' : 'bg-amber-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{record.description}</p>
                <p className="text-xs text-gray-500">{record.area} • {new Date(record.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${record.achieved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {record.achieved ? 'Alcançado' : 'Em progresso'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
