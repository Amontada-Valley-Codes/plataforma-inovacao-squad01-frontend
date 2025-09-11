import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, GripVertical, Plus, User, Clock, MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User as UserType } from '../app/context/UserContext';
import { Target } from 'lucide-react';

interface InnovationFunnelProps {
  user: UserType;
  onNavigate: (page: 'dashboard') => void;
}

const funnelStages = [
    {id: 'backlog', title: 'Backlog', color: 'bg-gray-500' },
    { id: 'capture', title: 'Geração/Captura', color: 'bg-blue-500' },
    { id: 'pre-screening', title: 'Pré-Triagem', color: 'bg-purple-500' },
    { id: 'ideation', title: 'Ideação', color: 'bg-cyan-500' },
    { id: 'detailed-screening', title: 'Triagem Detalhada', color: 'bg-yellow-500' },
    { id: 'poc', title: 'Experimentação (POC)', color: 'bg-green-500' },
];

const mockIdeas = [
  { id: 'idea-1', stage: 'capture', title: 'App de Recomendações com IA', priority: 'Alta', author: 'Ana Silva', comments: 3, days: 1 },
  { id: 'idea-2', stage: 'capture', title: 'Otimização de Rotas de Entrega', priority: 'Média', author: 'Carlos Santos', comments: 1, days: 2 },
  { id: 'idea-3', stage: 'pre-screening', title: 'Plataforma de Treinamento Gamificada', priority: 'Alta', author: 'Maria Costa', comments: 8, days: 5 },
  { id: 'idea-4', stage: 'ideation', title: 'Uso de Blockchain para Rastreabilidade', priority: 'Alta', author: 'Ana Silva', comments: 15, days: 12 },
  { id: 'idea-5', stage: 'ideation', title: 'Assistente Virtual para Clientes', priority: 'Baixa', author: 'João Pereira', comments: 5, days: 18 },
  { id: 'idea-6', stage: 'detailed-screening', title: 'Análise Preditiva de Churn', priority: 'Crítica', author: 'Carlos Santos', comments: 22, days: 25 },
  { id: 'idea-7', stage: 'poc', title: 'POC - Pagamentos com Reconhecimento Facial', priority: 'Crítica', author: 'Ana Silva', comments: 31, days: 40 },
];

export function InnovationFunnel({ user, onNavigate }: InnovationFunnelProps) {
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Alta': return <Badge variant="default" className="bg-orange-500">Alta</Badge>;
      case 'Média': return <Badge variant="secondary">Média</Badge>;
      case 'Baixa': return <Badge variant="outline">Baixa</Badge>;
      case 'Crítica': return <Badge variant="destructive">Crítica</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className='hover:bg-gray-300 cursor-pointer'
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <h1>Funil de Inovação</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6 bg-blue-900">
        <div className="flex gap-6 min-w-max h-full">
          {funnelStages.map(stage => (
            <div key={stage.id} className="w-80 bg-muted rounded-lg flex flex-col">
              {/* Column Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${stage.color}`}></span>
                    <h3 className="font-semibold">{stage.title}</h3>
                  </div>
                  <Badge variant="secondary">{mockIdeas.filter(idea => idea.stage === stage.id).length}</Badge>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 p-4 mt-2 space-y-4 overflow-y-auto rounded-2xl">
                {mockIdeas.filter(idea => idea.stage === stage.id).map(idea => (
                  <Card key={idea.id} className="cursor-grab active:cursor-grabbing bg-white">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        {getPriorityBadge(idea.priority)}
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-base mt-2">{idea.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{idea.days} dias</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{idea.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{idea.author}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Add Card Button */}
              <div className="p-4 mt-auto">
                <Button variant="ghost" className="w-full bg-blue-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Ideia
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}