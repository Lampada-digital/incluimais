import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Student, EducationalNeed, IndividualPlan, ProgressRecord, Strategy, CommunicationCard, FamilyMessage, Report, School, Classroom } from './types';

interface AppState {
  currentUser: User | null;
  users: User[];
  schools: School[];
  classrooms: Classroom[];
  students: Student[];
  needs: EducationalNeed[];
  plans: IndividualPlan[];
  progress: ProgressRecord[];
  strategies: Strategy[];
  cards: CommunicationCard[];
  messages: FamilyMessage[];
  reports: Report[];
  sidebarOpen: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addNeed: (need: EducationalNeed) => void;
  addPlan: (plan: IndividualPlan) => void;
  updatePlan: (plan: IndividualPlan) => void;
  addProgress: (record: ProgressRecord) => void;
  addMessage: (msg: FamilyMessage) => void;
  addReport: (report: Report) => void;
  toggleStrategyFavorite: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const demoSchools: School[] = [
  { id: 's1', name: 'Escola Municipal Inclusão', address: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP', phone: '(11) 3456-7890', email: 'contato@escolainclusao.edu.br' },
  { id: 's2', name: 'Colégio Esperança', address: 'Av. Brasil, 456', city: 'Rio de Janeiro', state: 'RJ', phone: '(21) 2345-6789', email: 'contato@colegioesperanca.edu.br' },
];

const demoClassrooms: Classroom[] = [
  { id: 'c1', name: '4º Ano A', year: '4º ano', schoolId: 's1', teacherId: 'u3' },
  { id: 'c2', name: '3º Ano B', year: '3º ano', schoolId: 's1', teacherId: 'u3' },
  { id: 'c3', name: '5º Ano A', year: '5º ano', schoolId: 's1', teacherId: 'u4' },
];

const demoUsers: User[] = [
  { id: 'u1', name: 'Admin Sistema', email: 'admin@inclui.com', role: 'admin', active: true },
  { id: 'u2', name: 'Maria Santos', email: 'maria@escola.com', role: 'gestor', schoolId: 's1', active: true },
  { id: 'u3', name: 'Ana Oliveira', email: 'ana@escola.com', role: 'professor', schoolId: 's1', active: true },
  { id: 'u4', name: 'Carlos Lima', email: 'carlos@escola.com', role: 'professor', schoolId: 's1', active: true },
  { id: 'u5', name: 'Dra. Patricia Souza', email: 'patricia@escola.com', role: 'especialista', schoolId: 's1', active: true },
  { id: 'u6', name: 'Roberto Silva', email: 'roberto@email.com', role: 'familia', schoolId: 's1', active: true },
  { id: 'u7', name: 'Juliana Costa', email: 'juliana@escola.com', role: 'coordenador', schoolId: 's1', active: true },
];

const demoStudents: Student[] = [
  {
    id: 'st1', name: 'Lucas Mendes', birthDate: '2016-03-15', schoolId: 's1', classroomId: 'c1', year: '4º ano',
    guardians: [{ id: 'g1', name: 'Roberto Silva', relationship: 'Pai', phone: '(11) 99999-1234', email: 'roberto@email.com', authorized: true }],
    diagnoses: ['TEA - Nível 1'], supportLevels: ['Nível 1'],
    strengths: ['Memória visual', 'Interesse por dinossauros', 'Habilidade com números'],
    interests: ['Dinossauros', 'Astronomia', 'Quebra-cabeças'],
    communicationForm: 'Verbal com apoio visual', sensoryNeeds: ['Sensibilidade a sons altos'],
    autonomyLevel: 'medio', supportNeeds: ['Rotina visual', 'Antecipação de mudanças'],
    observations: ['Responde bem a instruções visuais', 'Precisa de pausas sensoriais'], documents: [],
    createdAt: '2024-02-01', active: true
  },
  {
    id: 'st2', name: 'Sofia Almeida', birthDate: '2017-07-22', schoolId: 's1', classroomId: 'c2', year: '3º ano',
    guardians: [{ id: 'g2', name: 'Fernanda Almeida', relationship: 'Mãe', phone: '(11) 98888-5678', email: 'fernanda@email.com', authorized: true }],
    diagnoses: ['Dislexia', 'TDAH'], supportLevels: [],
    strengths: ['Criatividade', 'Expressão oral', 'Empatia'],
    interests: ['Desenho', 'Histórias', 'Animais'],
    communicationForm: 'Verbal', sensoryNeeds: [],
    autonomyLevel: 'alto', supportNeeds: ['Tempo adicional', 'Material adaptado'],
    observations: ['Excelente em atividades orais', 'Dificuldade com cópia do quadro'], documents: [],
    createdAt: '2024-01-15', active: true
  },
  {
    id: 'st3', name: 'Pedro Henrique', birthDate: '2015-11-08', schoolId: 's1', classroomId: 'c1', year: '4º ano',
    guardians: [{ id: 'g3', name: 'Marcos Santos', relationship: 'Pai', phone: '(11) 97777-9012', email: 'marcos@email.com', authorized: true }],
    diagnoses: ['TEA - Nível 2'], supportLevels: ['Nível 2'],
    strengths: ['Atenção a detalhes', 'Memória para fatos'],
    interests: ['Trens', 'Mapas', 'Música'],
    communicationForm: 'Verbal com frases curtas', sensoryNeeds: ['Sensibilidade tátil', 'Prefere ambientes organizados'],
    autonomyLevel: 'baixo', supportNeeds: ['Apoio para transições', 'Comunicação alternativa', 'Rotina estruturada'],
    observations: ['Comunica-se melhor com apoio visual', 'Necessita mediação em atividades sociais'], documents: [],
    createdAt: '2024-01-20', active: true
  },
  {
    id: 'st4', name: 'Isabela Ferreira', birthDate: '2016-05-30', schoolId: 's1', classroomId: 'c1', year: '4º ano',
    guardians: [{ id: 'g4', name: 'Cláudia Ferreira', relationship: 'Mãe', phone: '(11) 96666-3456', email: 'claudia@email.com', authorized: true }],
    diagnoses: ['AH/SD'], supportLevels: [],
    strengths: ['Raciocínio lógico avançado', 'Leitura avançada', 'Liderança'],
    interests: ['Ciência', 'Programação', 'Xadrez'],
    communicationForm: 'Verbal', sensoryNeeds: [],
    autonomyLevel: 'alto', supportNeeds: ['Desafios adicionais', 'Projetos de aprofundamento'],
    observations: ['Necessita de atividades desafiadoras', 'Pode atuar como tutora de colegas'], documents: [],
    createdAt: '2024-02-10', active: true
  },
  {
    id: 'st5', name: 'Gabriel Costa', birthDate: '2017-01-14', schoolId: 's1', classroomId: 'c3', year: '5º ano',
    guardians: [{ id: 'g5', name: 'André Costa', relationship: 'Pai', phone: '(11) 95555-7890', email: 'andre@email.com', authorized: true }],
    diagnoses: ['TOD'], supportLevels: [],
    strengths: ['Persistência', 'Inteligência emocional em desenvolvimento'],
    interests: ['Esportes', 'Jogos em grupo'],
    communicationForm: 'Verbal', sensoryNeeds: [],
    autonomyLevel: 'medio', supportNeeds: ['Estratégias de regulação', 'Mediação de conflitos'],
    observations: ['Responde bem a escolhas estruturadas', 'Necessita de reforço positivo'], documents: [],
    createdAt: '2024-03-01', active: true
  },
];

const demoNeeds: EducationalNeed[] = [
  { id: 'n1', studentId: 'st1', area: 'comunicacao', subArea: 'Comunicação não verbal', frequency: 'as_vezes', context: 'Em situações de ansiedade', strategiesUsed: ['Uso de cartões visuais', 'Timer visual'], results: 'Melhora significativa com apoio visual', date: '2024-03-15' },
  { id: 'n2', studentId: 'st1', area: 'comportamento', subArea: 'Flexibilidade', frequency: 'frequentemente', context: 'Mudanças na rotina', strategiesUsed: ['Antecipação com agenda visual', 'Histórias sociais'], results: 'Em progresso', date: '2024-03-20' },
  { id: 'n3', studentId: 'st2', area: 'aprendizagem', subArea: 'Leitura', frequency: 'frequentemente', context: 'Leitura em voz alta e cópia', strategiesUsed: ['Fonte ampliada', 'Tempo adicional', 'Leitor de tela'], results: 'Boa evolução com material adaptado', date: '2024-03-10' },
  { id: 'n4', studentId: 'st3', area: 'social', subArea: 'Interação com colegas', frequency: 'sempre', context: 'Atividades em grupo', strategiesUsed: ['Mediação do professor', 'Pares tutoriais'], results: 'Necessita continuidade do apoio', date: '2024-03-18' },
  { id: 'n5', studentId: 'st5', area: 'comportamento', subArea: 'Regulação emocional', frequency: 'frequentemente', context: 'Quando contrariado', strategiesUsed: ['Canto de regulação', 'Escolhas estruturadas'], results: 'Melhora com mediação consistente', date: '2024-03-22' },
];

const demoPlans: IndividualPlan[] = [
  {
    id: 'p1', studentId: 'st1', title: 'PEI - Lucas Mendes - 1º Semestre 2024',
    functionalProfile: 'Estudante com boa memória visual e interesse por temas específicos. Comunica-se verbalmente com apoio de recursos visuais.',
    strengths: 'Memória visual excepcional, interesse por dinossauros e astronomia, habilidade com números.',
    barriers: 'Sensibilidade sensorial a sons altos, dificuldade com mudanças inesperadas na rotina.',
    pedagogicalGoals: [
      { id: 'pg1', description: 'Ler textos curtos com apoio visual', status: 'em_desenvolvimento', progress: 60 },
      { id: 'pg2', description: 'Resolver operações matemáticas simples', status: 'alancado', progress: 85 },
      { id: 'pg3', description: 'Produzir textos curtos com tema de interesse', status: 'nao_iniciado', progress: 20 },
    ],
    autonomyGoals: [
      { id: 'ag1', description: 'Organizar material escolar com apoio de checklist', status: 'em_desenvolvimento', progress: 50 },
      { id: 'ag2', description: 'Seguir rotina visual com independência', status: 'alancado', progress: 75 },
    ],
    communicationGoals: [
      { id: 'cg1', description: 'Expressar necessidades usando cartões de comunicação', status: 'em_desenvolvimento', progress: 55 },
      { id: 'cg2', description: 'Participar de roda de conversa com apoio', status: 'nao_iniciado', progress: 30 },
    ],
    strategies: ['Uso de agenda visual diária', 'Timer para transições', 'Canto de regulação sensorial', 'Atividades com tema de interesse'],
    accessibilityResources: ['Fones abafadores', 'Cartões de comunicação', 'Agenda visual', 'Timer visual'],
    curricularAdaptations: ['Instruções fragmentadas', 'Apoio visual em todas as atividades', 'Tempo adicional quando necessário'],
    responsible: ['Ana Oliveira', 'Dra. Patricia Souza'],
    deadlines: 'Junho 2024',
    evolutionIndicators: ['Participação em atividades', 'Uso independente de recursos', 'Interação com colegas'],
    reviewDate: '2024-06-30',
    status: 'ativo', version: 2, createdAt: '2024-02-01', updatedAt: '2024-03-15'
  },
  {
    id: 'p2', studentId: 'st2', title: 'PEI - Sofia Almeida - 1º Semestre 2024',
    functionalProfile: 'Estudante criativa com excelente expressão oral. Apresenta dificuldades específicas em leitura e escrita.',
    strengths: 'Criatividade, expressão oral rica, empatia com colegas.',
    barriers: 'Dificuldade com decodificação de palavras, desatenção em tarefas longas.',
    pedagogicalGoals: [
      { id: 'pg4', description: 'Ler palavras com padrão silábico CV-CV', status: 'em_desenvolvimento', progress: 65 },
      { id: 'pg5', description: 'Produzir pequenos textos com apoio de imagens', status: 'alancado', progress: 80 },
    ],
    autonomyGoals: [
      { id: 'ag3', description: 'Organizar tarefas usando agenda', status: 'em_desenvolvimento', progress: 45 },
    ],
    communicationGoals: [
      { id: 'cg3', description: 'Participar ativamente de discussões em grupo', status: 'alancado', progress: 90 },
    ],
    strategies: ['Fonte ampliada', 'Tempo adicional', 'Uso de tecnologia assistiva', 'Divisão de tarefas'],
    accessibilityResources: ['Leitor de tela', 'Textos em fonte ampliada', 'Gravador de áudio'],
    curricularAdaptations: ['Avaliação oral quando possível', 'Textos com espaçamento ampliado'],
    responsible: ['Ana Oliveira'],
    deadlines: 'Junho 2024',
    evolutionIndicators: ['Fluência leitora', 'Produção textual', 'Participação'],
    reviewDate: '2024-06-30',
    status: 'ativo', version: 1, createdAt: '2024-01-20', updatedAt: '2024-01-20'
  },
];

const demoProgress: ProgressRecord[] = [
  { id: 'pr1', studentId: 'st1', date: '2024-03-01', area: 'Pedagógico', description: 'Lucas conseguiu resolver 5 operações de adição com apoio visual', achieved: true, strategies: ['Material concreto', 'Apoio visual'], notes: 'Excelente progresso' },
  { id: 'pr2', studentId: 'st1', date: '2024-03-08', area: 'Comunicação', description: 'Usou cartão de comunicação para pedir pausa', achieved: true, strategies: ['Cartões visuais'], notes: 'Independência crescente' },
  { id: 'pr3', studentId: 'st1', date: '2024-03-15', area: 'Social', description: 'Participou de atividade em dupla com mediação', achieved: true, strategies: ['Pares tutoriais'], notes: 'Interação positiva' },
  { id: 'pr4', studentId: 'st2', date: '2024-03-05', area: 'Pedagógico', description: 'Leu texto curto com apoio de imagens', achieved: true, strategies: ['Texto com imagens', 'Fonte ampliada'], notes: 'Motivação alta' },
  { id: 'pr5', studentId: 'st3', date: '2024-03-10', area: 'Autonomia', description: 'Seguiu rotina visual com 2 lembretes', achieved: false, strategies: ['Agenda visual', 'Timer'], notes: 'Em progresso, necessita continuidade' },
  { id: 'pr6', studentId: 'st5', date: '2024-03-12', area: 'Comportamento', description: 'Utilizou canto de regulação antes de reagir', achieved: true, strategies: ['Canto de regulação', 'Escolhas'], notes: 'Grande avanço na autorregulação' },
];

const demoStrategies: Strategy[] = [
  { id: 'str1', title: 'Agenda Visual Diária', description: 'Criar uma sequência visual das atividades do dia utilizando imagens ou pictogramas.', category: 'Organização', needs: ['TEA', 'TDAH', 'DI'], subject: 'Geral', ageRange: '6-12 anos', year: 'Todos', skills: ['Organização', 'Antecipação'], objective: 'Reduzir ansiedade e aumentar autonomia', resources: 'Cartões plastificados, velcro, quadro de rotina', steps: ['Selecionar pictogramas das atividades', 'Organizar em sequência', 'Permitir que o estudante mova os cartões ao completar'], favorite: false },
  { id: 'str2', title: 'Timer Visual para Transições', description: 'Utilizar timer visual (como Time Timer) para indicar o tempo restante de cada atividade.', category: 'Regulação', needs: ['TEA', 'TDAH'], subject: 'Geral', ageRange: '5-14 anos', year: 'Todos', skills: ['Regulação temporal', 'Flexibilidade'], objective: 'Facilitar transições entre atividades', resources: 'Timer visual, ampulheta digital', steps: ['Apresentar o timer antes da atividade', 'Explicar o que acontece quando o tempo acabar', 'Dar avisos prévios'], favorite: true },
  { id: 'str3', title: 'Divisão de Tarefas em Etapas', description: 'Fragmentar atividades complexas em etapas menores e sequenciais.', category: 'Aprendizagem', needs: ['DI', 'TDAH', 'Dislexia'], subject: 'Geral', ageRange: '6-15 anos', year: 'Todos', skills: ['Planejamento', 'Organização'], objective: 'Reduzir sobrecarga cognitiva', resources: 'Checklist visual, numeração de etapas', steps: ['Identificar etapas da tarefa', 'Criar checklist visual', 'Permitir marcação de etapas concluídas'], favorite: false },
  { id: 'str4', title: 'Histórias Sociais', description: 'Criar narrativas curtas com imagens que descrevem situações sociais e comportamentos esperados.', category: 'Social', needs: ['TEA'], subject: 'Geral', ageRange: '5-12 anos', year: 'Todos', skills: ['Interação social', 'Compreensão'], objective: 'Ensinar habilidades sociais de forma concreta', resources: 'Imagens, livro personalizado', steps: ['Escolher situação a ser trabalhada', 'Criar narrativa com imagens', 'Ler regularmente com o estudante'], favorite: true },
  { id: 'str5', title: 'Fonte Ampliada e Espaçamento', description: 'Apresentar textos com fonte maior (Arial 14+) e espaçamento entre linhas ampliado.', category: 'Leitura', needs: ['Dislexia', 'DI'], subject: 'Língua Portuguesa', ageRange: '7-15 anos', year: '1º ao 9º', skills: ['Leitura', 'Decodificação'], objective: 'Facilitar a leitura e reduzir cansaço visual', resources: 'Documentos formatados, impressora', steps: ['Reformatar textos em fonte Arial 14', 'Aumentar espaçamento entre linhas', 'Utilizar papel de cor suave'], favorite: false },
  { id: 'str6', title: 'Canto de Regulação Sensorial', description: 'Criar um espaço na sala com recursos sensoriais para momentos de desregulação.', category: 'Regulação', needs: ['TEA', 'TDAH', 'TOD'], subject: 'Geral', ageRange: '5-14 anos', year: 'Todos', skills: ['Autorregulação', 'Consciência corporal'], objective: 'Oferecer espaço seguro para regulação emocional', resources: 'Fones abafadores, almofadas, objetos sensoriais', steps: ['Definir espaço na sala', 'Organizar recursos sensoriais', 'Ensinar uso do espaço'], favorite: false },
  { id: 'str7', title: 'Atividades de Aprofundamento', description: 'Propor desafios adicionais e projetos de investigação para estudantes com altas habilidades.', category: 'Aprofundamento', needs: ['AH/SD'], subject: 'Geral', ageRange: '8-15 anos', year: '3º ao 9º', skills: ['Pensamento crítico', 'Investigação'], objective: 'Manter engajamento e desenvolver potencial', resources: 'Materiais de pesquisa, projetos abertos', steps: ['Identificar áreas de interesse', 'Propor projeto de investigação', 'Orientar e acompanhar'], favorite: false },
  { id: 'str8', title: 'Escolhas Estruturadas', description: 'Oferecer opções limitadas e estruturadas ao invés de instruções abertas.', category: 'Comunicação', needs: ['TEA', 'TOD', 'DI'], subject: 'Geral', ageRange: '5-14 anos', year: 'Todos', skills: ['Tomada de decisão', 'Autonomia'], objective: 'Reduzir conflitos e aumentar senso de controle', resources: 'Cartões de escolha, quadro de opções', steps: ['Oferecer 2-3 opções claras', 'Usar suporte visual', 'Respeitar a escolha feita'], favorite: true },
];

const demoCards: CommunicationCard[] = [
  { id: 'cc1', studentId: 'st1', type: 'necessidade', title: 'Preciso de uma pausa', symbol: '⏸️', color: '#3b82f6', order: 1 },
  { id: 'cc2', studentId: 'st1', type: 'necessidade', title: 'Está muito barulho', symbol: '🔇', color: '#ef4444', order: 2 },
  { id: 'cc3', studentId: 'st1', type: 'escolha', title: 'Quero trabalhar com dinossauros', symbol: '🦕', color: '#22c55e', order: 3 },
  { id: 'cc4', studentId: 'st1', type: 'emocao', title: 'Estou calmo', symbol: '😊', color: '#22c55e', order: 4 },
  { id: 'cc5', studentId: 'st1', type: 'emocao', title: 'Estou ansioso', symbol: '😰', color: '#f59e0b', order: 5 },
  { id: 'cc6', studentId: 'st1', type: 'rotina', title: 'Matemática', symbol: '🔢', color: '#8b5cf6', order: 6 },
  { id: 'cc7', studentId: 'st1', type: 'rotina', title: 'Português', symbol: '📖', color: '#06b6d4', order: 7 },
  { id: 'cc8', studentId: 'st1', type: 'rotina', title: 'Recreio', symbol: '🎮', color: '#f97316', order: 8 },
];

const demoMessages: FamilyMessage[] = [
  { id: 'm1', studentId: 'st1', senderId: 'u3', senderName: 'Prof. Ana Oliveira', content: 'Lucas teve um ótimo progresso esta semana! Conseguiu resolver as operações com independência e usou os cartões de comunicação espontaneamente.', date: '2024-03-20', read: true },
  { id: 'm2', studentId: 'st1', senderId: 'u6', senderName: 'Roberto Silva', content: 'Obrigado pelo retorno! Em casa ele tem mostrado interesse em praticar as operações. Podemos ajudar de alguma forma?', date: '2024-03-21', read: true },
  { id: 'm3', studentId: 'st2', senderId: 'u3', senderName: 'Prof. Ana Oliveira', content: 'Sofia participou ativamente da discussão sobre o livro. Sua contribuição oral foi excelente!', date: '2024-03-18', read: true },
];

const demoReports: Report[] = [
  { id: 'r1', studentId: 'st1', type: 'pei', title: 'PEI - Lucas Mendes - Março 2024', content: 'Relatório do Plano Educacional Individualizado...', generatedBy: 'Ana Oliveira', date: '2024-03-25' },
  { id: 'r2', studentId: 'st2', type: 'evolucao', title: 'Relatório de Evolução - Sofia Almeida', content: 'Relatório de evolução pedagógica...', generatedBy: 'Ana Oliveira', date: '2024-03-20' },
];

function loadState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`inclui_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveState(key: string, value: unknown) {
  localStorage.setItem(`inclui_${key}`, JSON.stringify(value));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('currentUser', null));
  const [students, setStudents] = useState<Student[]>(() => loadState('students', demoStudents));
  const [needs, setNeeds] = useState<EducationalNeed[]>(() => loadState('needs', demoNeeds));
  const [plans, setPlans] = useState<IndividualPlan[]>(() => loadState('plans', demoPlans));
  const [progress, setProgress] = useState<ProgressRecord[]>(() => loadState('progress', demoProgress));
  const [strategies, setStrategies] = useState<Strategy[]>(() => loadState('strategies', demoStrategies));
  const [cards, setCards] = useState<CommunicationCard[]>(() => loadState('cards', demoCards));
  const [messages, setMessages] = useState<FamilyMessage[]>(() => loadState('messages', demoMessages));
  const [reports, setReports] = useState<Report[]>(() => loadState('reports', demoReports));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { saveState('students', students); }, [students]);
  useEffect(() => { saveState('needs', needs); }, [needs]);
  useEffect(() => { saveState('plans', plans); }, [plans]);
  useEffect(() => { saveState('progress', progress); }, [progress]);
  useEffect(() => { saveState('strategies', strategies); }, [strategies]);
  useEffect(() => { saveState('cards', cards); }, [cards]);
  useEffect(() => { saveState('messages', messages); }, [messages]);
  useEffect(() => { saveState('reports', reports); }, [reports]);
  useEffect(() => { saveState('currentUser', currentUser); }, [currentUser]);

  const login = (email: string, _password: string): boolean => {
    const user = demoUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    // Demo: accept any email
    setCurrentUser({ id: 'demo', name: 'Usuário Demo', email, role: 'professor', schoolId: 's1', active: true });
    return true;
  };

  const logout = () => setCurrentUser(null);

  const addStudent = (student: Student) => setStudents(prev => [...prev, student]);
  const updateStudent = (student: Student) => setStudents(prev => prev.map(s => s.id === student.id ? student : s));
  const deleteStudent = (id: string) => setStudents(prev => prev.filter(s => s.id !== id));
  const addNeed = (need: EducationalNeed) => setNeeds(prev => [...prev, need]);
  const addPlan = (plan: IndividualPlan) => setPlans(prev => [...prev, plan]);
  const updatePlan = (plan: IndividualPlan) => setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  const addProgress = (record: ProgressRecord) => setProgress(prev => [...prev, record]);
  const addMessage = (msg: FamilyMessage) => setMessages(prev => [...prev, msg]);
  const addReport = (report: Report) => setReports(prev => [...prev, report]);
  const toggleStrategyFavorite = (id: string) => setStrategies(prev => prev.map(s => s.id === id ? { ...s, favorite: !s.favorite } : s));

  return (
    <AppContext.Provider value={{
      currentUser, users: demoUsers, schools: demoSchools, classrooms: demoClassrooms,
      students, needs, plans, progress, strategies, cards, messages, reports, sidebarOpen,
      login, logout, setSidebarOpen, addStudent, updateStudent, deleteStudent,
      addNeed, addPlan, updatePlan, addProgress, addMessage, addReport, toggleStrategyFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
