import React, { useState } from 'react';
import { useApp } from '../store';
import { MessageCircle, Send, Eye, FileText, Heart, Calendar } from 'lucide-react';

export default function FamilyPortal() {
  const { students, messages, plans, progress, addMessage, currentUser } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'goals' | 'progress' | 'info'>('messages');

  const studentMessages = messages.filter(m => m.studentId === selectedStudent);
  const studentPlan = plans.find(p => p.studentId === selectedStudent);
  const studentProgress = progress.filter(p => p.studentId === selectedStudent);
  const student = students.find(s => s.id === selectedStudent);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    addMessage({
      id: `m_${Date.now()}`,
      studentId: selectedStudent,
      senderId: currentUser?.id || '',
      senderName: currentUser?.name || 'Família',
      content: newMessage,
      date: new Date().toISOString().split('T')[0],
      read: false
    });
    setNewMessage('');
  };

  const tabs = [
    { id: 'messages', label: 'Comunicados', icon: MessageCircle },
    { id: 'goals', label: 'Objetivos', icon: Heart },
    { id: 'progress', label: 'Evolução', icon: Calendar },
    { id: 'info', label: 'Informações', icon: Eye },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portal da Família</h1>
        <p className="text-gray-500 text-sm">Acompanhe o desenvolvimento educacional do seu filho(a)</p>
      </div>

      {/* Student selector */}
      <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none">
        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {studentMessages.length > 0 ? studentMessages.map(msg => (
                <div key={msg.id} className={`p-4 ${msg.senderId === currentUser?.id ? 'bg-primary-50/30' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{msg.senderName}</span>
                    <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.content}</p>
                </div>
              )) : (
                <div className="p-8 text-center">
                  <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Nenhuma mensagem ainda</p>
                </div>
              )}
            </div>
          </div>

          {/* Send message */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escreva uma mensagem para a escola..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none"
              />
              <button onClick={handleSendMessage}
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Suas mensagens serão enviadas para o professor responsável.</p>
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && studentPlan && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">{studentPlan.title}</h3>
            <p className="text-sm text-gray-500 mb-4">Revisão: {new Date(studentPlan.reviewDate).toLocaleDateString('pt-BR')}</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-blue-700 mb-2">📚 Objetivos Pedagógicos</h4>
                <div className="space-y-2">
                  {studentPlan.pedagogicalGoals.map(goal => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{goal.description}</p>
                        <div className="w-full h-1.5 bg-blue-100 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-blue-600">{goal.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">🌱 Objetivos de Autonomia</h4>
                <div className="space-y-2">
                  {studentPlan.autonomyGoals.map(goal => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-green-50/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{goal.description}</p>
                        <div className="w-full h-1.5 bg-green-100 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-green-600">{goal.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-purple-700 mb-2">💬 Objetivos de Comunicação</h4>
                <div className="space-y-2">
                  {studentPlan.communicationGoals.map(goal => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{goal.description}</p>
                        <div className="w-full h-1.5 bg-purple-100 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-purple-600">{goal.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Como ajudar em casa:</strong> Converse com o professor sobre formas de apoiar os objetivos em casa. 
              Cada pequena conquista é importante!
            </p>
          </div>
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-3">
          {studentProgress.length > 0 ? studentProgress.slice().reverse().map(rec => (
            <div key={rec.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{rec.area}</span>
                <span className="text-xs text-gray-400">{new Date(rec.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="text-sm text-gray-700">{rec.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rec.achieved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {rec.achieved ? '✓ Alcançado' : '↗ Em desenvolvimento'}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nenhum registro de evolução disponível</p>
            </div>
          )}
        </div>
      )}

      {/* Info Tab */}
      {activeTab === 'info' && student && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Informações Compartilhadas</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Forma de comunicação</p>
                <p className="text-sm text-gray-800">{student.communicationForm}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Potencialidades</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {student.strengths.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Interesses</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {student.interests.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Necessidades de apoio</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {student.supportNeeds.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-sm text-green-800">
              🤝 <strong>Parceria escola-família:</strong> Você é fundamental no desenvolvimento do seu filho(a). 
              Compartilhe informações relevantes com a escola e participe ativamente do processo educacional.
            </p>
          </div>
        </div>
      )}

      {!studentPlan && activeTab === 'goals' && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Nenhum plano individualizado disponível</p>
        </div>
      )}
    </div>
  );
}
