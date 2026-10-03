import React, { useState } from 'react';
import { useApp } from '../store';
import { Brain, Send, Sparkles, AlertTriangle, BookOpen, FileText, Lightbulb, Users } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  { icon: BookOpen, label: 'Sugerir estratégias de ensino', prompt: 'Sugira estratégias de ensino para um estudante com TEA nível 1 que tem dificuldade em transições entre atividades.' },
  { icon: FileText, label: 'Adaptar atividade', prompt: 'Como adaptar uma atividade de matemática do 4º ano sobre operações de adição para um estudante com dislexia?' },
  { icon: Lightbulb, label: 'Criar história social', prompt: 'Crie uma história social curta sobre como pedir ajuda ao professor para um estudante de 8 anos com TEA.' },
  { icon: Users, label: 'Sugerir atividade de grupo', prompt: 'Sugira uma atividade em grupo inclusiva para uma turma de 3º ano com estudantes com diferentes necessidades.' },
];

function generateAIResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('estratégia') || lowerPrompt.includes('teaching') || lowerPrompt.includes('ensino')) {
    return `## Estratégias Sugeridas para Transições

Com base nas informações fornecidas, aqui estão estratégias recomendadas:

### 1. **Antecipação Visual**
- Utilize uma agenda visual com pictogramas das atividades do dia
- Avise com 5 minutos de antecedência sobre a mudança
- Use um timer visual (como Time Timer) para indicar o tempo restante

### 2. **Ritual de Transição**
- Crie uma sequência consistente: terminar → guardar → verificar agenda → iniciar próxima
- Permita que o estudante mova o pictograma da atividade concluída
- Use uma música ou sinal sonoro suave como transição

### 3. **Objeto de Transição**
- Permita que o estudante leve um objeto da atividade anterior
- Use um "cartão de transição" que ele pode segurar

### 4. **Reforço Positivo**
- Elogie especificamente quando a transição for bem-sucedida
- Use sistema de recompensas visual

> ⚠️ **Importante:** Estas são sugestões pedagógicas. A equipe deve avaliar a adequação para cada estudante e ajustar conforme necessário. Toda estratégia deve ser revisada por profissional qualificado.`;
  }
  
  if (lowerPrompt.includes('adaptar') || lowerPrompt.includes('atividade') || lowerPrompt.includes('matemática')) {
    return `## Adaptação de Atividade de Matemática — 4º Ano

### Atividade Original
Operações de adição com números de 3 algarismos.

### Adaptações Recomendadas

**1. Formatação:**
- Fonte Arial, tamanho 14 ou maior
- Espaçamento ampliado entre questões
- Uma operação por linha
- Papel de cor suave (amarelo claro ou azul claro)

**2. Instruções:**
- Fragmentar em etapas numeradas
- Usar linguagem direta e curta
- Exemplo: "Passo 1: Some as unidades. Passo 2: Some as dezenas."

**3. Apoio Visual:**
- Incluir representação com material dourado
- Usar cores para alinhar colunas (unidade=verde, dezena=azul, centena=vermelho)

**4. Tempo:**
- Oferecer tempo adicional
- Permitir uso de calculadora como verificação

**5. Avaliação:**
- Valorizar o processo, não apenas o resultado
- Permitir resposta oral quando necessário

> ⚠️ **Nota:** Revise a adaptação antes de aplicar. Ajuste conforme as necessidades específicas do estudante.`;
  }
  
  if (lowerPrompt.includes('história social') || lowerPrompt.includes('historia')) {
    return `## História Social: Pedindo Ajuda ao Professor

### 📘 "Quando Preciso de Ajuda"

*Às vezes, na escola, eu preciso de ajuda.*
*Isso é normal. Todos precisam de ajuda às vezes.*

**Quando eu preciso de ajuda, eu posso:**

1. 🙋 Levantar a mão e esperar o professor olhar para mim
2. 🗣️ Dizer: "Professor(a), preciso de ajuda, por favor"
3. 📋 Ou mostrar o cartão de "preciso de ajuda"

**O que acontece depois?**
- O professor vem até mim
- Ele me ajuda com o que eu preciso
- Eu me sinto melhor!

**Lembre-se:**
✅ Pedir ajuda é inteligente
✅ O professor gosta de ajudar
✅ Eu consigo pedir ajuda

---
*Esta história social deve ser lida regularmente com o estudante, em momento tranquilo. Ajuste conforme necessário com a equipe.*`;
  }

  if (lowerPrompt.includes('grupo') || lowerPrompt.includes('inclusiva') || lowerPrompt.includes('turma')) {
    return `## Atividade em Grupo Inclusiva — 3º Ano

### 🎯 "Expedição dos Animais"

**Objetivo:** Promover colaboração, valorizar diferentes habilidades e garantir participação de todos.

**Organização:**
- Grupos de 4 estudantes (mistos)
- Cada membro tem um papel definido:
  - 🔍 Pesquisador (busca informações)
  - 🎨 Artista (faz o desenho/cartaz)
  - 🗣️ Apresentador (compartilha com a turma)
  - 📝 Registrador (anota as descobertas)

**Materiais:**
- Cartões com informações sobre animais (texto + imagem)
- Cartolina, lápis de cor, cola
- Quadro de papéis com pictogramas

**Adaptações:**
- Informações em formato visual e textual
- Tempo flexível para cada etapa
- Possibilidade de resposta oral, escrita ou por desenho
- Instruções fragmentadas em checklist visual

**Avaliação:**
- Valorizar a participação de cada membro
- Autoavaliação com carinhas (😊 😐 😟)
- Feedback específico para cada contribuição

> ⚠️ **Importante:** Os papéis devem ser definidos considerando as potencialidades de cada estudante. Revise com a equipe pedagógica.`;
  }

  return `## Resposta do INCLUI+ IA

Obrigado pela sua pergunta! Com base nas informações fornecidas, aqui estão algumas considerações:

### Sugestões Gerais:
1. **Individualize** — Considere as necessidades específicas do estudante
2. **Use apoios visuais** — Imagens, pictogramas e esquemas ajudam na compreensão
3. **Fragmente tarefas** — Divida atividades complexas em etapas menores
4. **Ofereça escolhas** — Permita que o estudante tenha autonomia dentro de limites estruturados
5. **Valorize potencialidades** — Use os interesses do estudante como ponte para aprendizagem

### Próximos Passos:
- Consulte a Biblioteca de Estratégias Pedagógicas
- Verifique o perfil do estudante para mais detalhes
- Discuta com a equipe pedagógica

> ⚠️ **Aviso:** As respostas da IA são sugestões pedagógicas e devem ser revisadas por um profissional qualificado antes de serem aplicadas. A IA não realiza diagnósticos nem substitui a avaliação profissional.

Se precisar de algo mais específico, reformule sua pergunta!`;
}

export default function AIAssistant() {
  const { students } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o **INCLUI+ IA**, seu assistente pedagógico. Posso ajudar com:\n\n- 📚 Sugerir estratégias de ensino\n- 📝 Adaptar atividades escolares\n- 📖 Criar histórias sociais\n- 🎯 Elaborar planos individualizados\n- 💡 Organizar observações pedagógicas\n\nComo posso ajudar você hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  const handleSend = (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const response = generateAIResponse(content);
      const aiMsg: Message = { id: `a_${Date.now()}`, role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="text-lg font-bold text-gray-900 mt-4 mb-2">{line.replace('## ', '')}</h3>;
      if (line.startsWith('### ')) return <h4 key={i} className="text-base font-semibold text-gray-800 mt-3 mb-1">{line.replace('### ', '')}</h4>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm text-gray-700 ml-4 list-disc">{line.replace(/^[-*] /, '')}</li>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-amber-300 bg-amber-50 px-3 py-2 my-2 text-sm text-amber-800 rounded-r">{line.replace('> ', '')}</blockquote>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-gray-800 mt-2">{line.replace(/\*\*/g, '')}</p>;
      if (line.match(/^\d+\./)) return <li key={i} className="text-sm text-gray-700 ml-4 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-sm text-gray-700">{line}</p>;
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">INCLUI+ IA</h1>
            <p className="text-xs text-gray-500">Assistente Pedagógico Inteligente</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            As respostas são sugestões pedagógicas e devem ser revisadas por profissional qualificado. 
            A IA não realiza diagnósticos, não determina níveis de suporte e não substitui avaliação profissional.
          </p>
        </div>
      </div>

      {/* Student selector */}
      <div className="flex-shrink-0 mb-3">
        <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary-400 outline-none">
          <option value="">Contexto geral (sem estudante específico)</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-br-md' 
                : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm">{formatContent(msg.content)}</div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                <span className="text-sm text-gray-500">Gerando resposta...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 mb-3">
          <p className="text-xs text-gray-500 mb-2">Sugestões rápidas:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <button key={i} onClick={() => handleSend(s.prompt)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left">
                  <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Digite sua pergunta pedagógica..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
