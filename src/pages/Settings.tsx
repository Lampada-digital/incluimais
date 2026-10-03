import React, { useState } from 'react';
import { useApp } from '../store';
import { Settings as SettingsIcon, Users, School, Shield, Bell, Palette, Database, Key } from 'lucide-react';

export default function Settings() {
  const { currentUser, users, schools } = useApp();
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'Geral', icon: SettingsIcon },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'schools', label: 'Escolas', icon: School },
    { id: 'permissions', label: 'Permissões', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'data', label: 'Dados e LGPD', icon: Database },
    { id: 'security', label: 'Segurança', icon: Key },
  ];

  const roleLabels: Record<string, string> = {
    admin: 'Administrador', gestor: 'Gestor Escolar', coordenador: 'Coordenador Pedagógico',
    professor: 'Professor', especialista: 'Profissional Especializado',
    familia: 'Família', estudante: 'Estudante'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 text-sm">Gerencie a plataforma e suas preferências</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                    activeSection === section.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'general' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da plataforma</label>
                  <input defaultValue="INCLUI+" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                  <input defaultValue="Educação inclusiva, desenvolvimento individual e oportunidades para todos" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idioma padrão</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">Salvar alterações</button>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Usuários do Sistema</h3>
                <button className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">+ Novo Usuário</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Nome</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-500">E-mail</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Perfil</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 px-2 text-gray-600">{user.email}</td>
                        <td className="py-3 px-2">
                          <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">{roleLabels[user.role]}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${user.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {user.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'schools' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Escolas Cadastradas</h3>
              <div className="space-y-3">
                {schools.map(school => (
                  <div key={school.id} className="p-4 border border-gray-100 rounded-xl">
                    <h4 className="font-medium text-gray-900">{school.name}</h4>
                    <p className="text-sm text-gray-500">{school.address}, {school.city} - {school.state}</p>
                    <p className="text-sm text-gray-500">{school.phone} • {school.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'permissions' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Controle de Permissões</h3>
              <p className="text-sm text-gray-500">Configure o que cada perfil pode acessar no sistema.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 font-medium text-gray-500">Módulo</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-500">Admin</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-500">Gestor</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-500">Coord.</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-500">Prof.</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-500">Família</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Dashboard', 'Estudantes', 'Planos PEI', 'Evolução', 'Relatórios', 'Comunicação'].map(mod => (
                      <tr key={mod} className="border-b border-gray-50">
                        <td className="py-3 px-2 font-medium text-gray-700">{mod}</td>
                        <td className="py-3 px-2 text-center"><span className="text-green-600">✓</span></td>
                        <td className="py-3 px-2 text-center"><span className="text-green-600">✓</span></td>
                        <td className="py-3 px-2 text-center"><span className="text-green-600">✓</span></td>
                        <td className="py-3 px-2 text-center"><span className="text-green-600">✓</span></td>
                        <td className="py-3 px-2 text-center"><span className="text-amber-600">◐</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400">✓ Acesso completo • ◐ Acesso restrito • ✗ Sem acesso</p>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
              <div className="space-y-3">
                {['Novo registro de evolução', 'Plano próximo da revisão', 'Nova mensagem da família', 'Novo estudante cadastrado'].map((item, i) => (
                  <label key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                    <span className="text-sm text-gray-700">{item}</span>
                    <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Aparência e Acessibilidade</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho da fonte</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                    <option>Pequeno</option><option selected>Médio (padrão)</option><option>Grande</option><option>Extra grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alto contraste</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none">
                    <option>Desativado</option><option>Ativado</option>
                  </select>
                </div>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <span className="text-sm text-gray-700">Modo daltonismo</span>
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <span className="text-sm text-gray-700">Leitor de tela otimizado</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                </label>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dados e LGPD</h3>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>Conformidade LGPD:</strong> O sistema protege dados pessoais conforme a Lei Geral de Proteção de Dados. 
                  Dados de crianças e adolescentes possuem proteção especial.
                </p>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">Dados armazenados localmente (demonstração)</p>
                  <p className="text-xs text-gray-500">Em produção, os dados são criptografados e armazenados em banco seguro.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">Isolamento entre instituições</p>
                  <p className="text-xs text-gray-500">Cada escola acessa apenas seus próprios dados.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">Dados de IA</p>
                  <p className="text-xs text-gray-500">Dados identificáveis não são utilizados para treinamento de IA sem autorização.</p>
                </div>
              </div>
              <button className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50">
                Solicitar exclusão de dados
              </button>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Segurança</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alterar senha</label>
                  <input type="password" placeholder="Nova senha" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
                  <input type="password" placeholder="Confirmar nova senha" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary-400" />
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">Atualizar senha</button>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sessões ativas</h4>
                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Navegador atual</p>
                    <p className="text-xs text-gray-500">Último acesso: agora</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Ativa</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
