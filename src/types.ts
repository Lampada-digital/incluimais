export type UserRole = 'admin' | 'gestor' | 'coordenador' | 'professor' | 'especialista' | 'familia' | 'estudante';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
  active: boolean;
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

export interface Classroom {
  id: string;
  name: string;
  year: string;
  schoolId: string;
  teacherId: string;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  authorized: boolean;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  schoolId: string;
  classroomId: string;
  year: string;
  guardians: Guardian[];
  diagnoses: string[];
  supportLevels: string[];
  strengths: string[];
  interests: string[];
  communicationForm: string;
  sensoryNeeds: string[];
  autonomyLevel: 'baixo' | 'medio' | 'alto';
  supportNeeds: string[];
  observations: string[];
  documents: string[];
  createdAt: string;
  active: boolean;
}

export interface EducationalNeed {
  id: string;
  studentId: string;
  area: 'aprendizagem' | 'comunicacao' | 'comportamento' | 'autonomia' | 'social';
  subArea: string;
  frequency: 'raramente' | 'as_vezes' | 'frequentemente' | 'sempre';
  context: string;
  strategiesUsed: string[];
  results: string;
  date: string;
}

export interface IndividualPlan {
  id: string;
  studentId: string;
  title: string;
  functionalProfile: string;
  strengths: string;
  barriers: string;
  pedagogicalGoals: Goal[];
  autonomyGoals: Goal[];
  communicationGoals: Goal[];
  strategies: string[];
  accessibilityResources: string[];
  curricularAdaptations: string[];
  responsible: string[];
  deadlines: string;
  evolutionIndicators: string[];
  reviewDate: string;
  status: 'rascunho' | 'ativo' | 'revisao' | 'concluido';
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  description: string;
  status: 'nao_iniciado' | 'em_desenvolvimento' | 'alancado';
  progress: number;
}

export interface ProgressRecord {
  id: string;
  studentId: string;
  date: string;
  area: string;
  description: string;
  achieved: boolean;
  strategies: string[];
  notes: string;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  category: string;
  needs: string[];
  subject: string;
  ageRange: string;
  year: string;
  skills: string[];
  objective: string;
  resources: string;
  steps: string[];
  favorite: boolean;
}

export interface CommunicationCard {
  id: string;
  studentId: string;
  type: 'pictograma' | 'rotina' | 'emocao' | 'escolha' | 'necessidade';
  title: string;
  symbol: string;
  color: string;
  order: number;
}

export interface FamilyMessage {
  id: string;
  studentId: string;
  senderId: string;
  senderName: string;
  content: string;
  date: string;
  read: boolean;
}

export interface Report {
  id: string;
  studentId?: string;
  type: 'individual' | 'pedagogico' | 'pei' | 'evolucao' | 'participacao' | 'familia' | 'turma' | 'institucional';
  title: string;
  content: string;
  generatedBy: string;
  date: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}
