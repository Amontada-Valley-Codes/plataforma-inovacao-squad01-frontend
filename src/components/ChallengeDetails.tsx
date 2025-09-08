import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Users, 
  Building2, 
  Heart, 
  MessageCircle, 
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { User, Challenge, Startup } from '../app/context/UserContext';

interface ChallengeDetailsProps {
  user: User;
  challenge: Challenge;
  onNavigate: (page: 'dashboard' | 'startup-database') => void;
}

export function ChallengeDetails({ user, challenge, onNavigate }: ChallengeDetailsProps) {
  const [selectedStartups, setSelectedStartups] = useState<string[]>([]);

  // Mock data de startups recomendadas para este desafio
  const recommendedStartups: (Startup & { 
    matchScore: number; 
    connectionStatus: 'nenhum' | 'interesse' | 'convidada' | 'poc' | 'rejeitada';
    lastInteraction?: string;
  })[] = [
    {
      id: '1',
      name: 'FinanceAI',
      segment: 'FinTech',
      stage: 'tracao',
      technology: 'IA, Machine Learning',
      problem: 'Automação de processos financeiros',
      description: 'Plataforma de IA para automação inteligente de processos financeiros corporativos, reduzindo custos operacionais em até 60%.',
      matchScore: 95,
      connectionStatus: 'interesse',
      lastInteraction: '2024-01-10'
    },
    {
      id: '2',
      name: 'ProcessBot',
      segment: 'FinTech',
      stage: 'operacao',
      technology: 'RPA, IA',
      problem: 'Automação robótica de processos',
      description: 'Solução de RPA especializada em processos financeiros com inteligência artificial integrada.',
      matchScore: 88,
      connectionStatus: 'nenhum'
    },
    {
      id: '3',
      name: 'SmartAudit',
      segment: 'FinTech',
      stage: 'tracao',
      technology: 'IA, Analytics',
      problem: 'Auditoria automatizada',
      description: 'Sistema de auditoria financeira automatizada com detecção de anomalias por IA.',
      matchScore: 82,
      connectionStatus: 'convidada',
      lastInteraction: '2024-01-08'
    },
    {
      id: '4',
      name: 'ComplianceAI',
      segment: 'FinTech',
      stage: 'escala',
      technology: 'IA, Compliance',
      problem: 'Compliance automatizado',
      description: 'Plataforma de compliance financeiro automatizado com monitoramento em tempo real.',
      matchScore: 76,
      connectionStatus: 'poc',
      lastInteraction: '2024-01-05'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      nenhum: 'bg-gray-100 text-gray-800',
      interesse: 'bg-blue-100 text-blue-800',
      convidada: 'bg-yellow-100 text-yellow-800',
      poc: 'bg-green-100 text-green-800',
      rejeitada: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      nenhum: 'Não Contatada',
      interesse: 'Interesse Registrado',
      convidada: 'Convidada para POC',
      poc: 'POC em Andamento',
      rejeitada: 'Rejeitada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interesse': return <Heart className="w-4 h-4" />;
      case 'convidada': return <Send className="w-4 h-4" />;
      case 'poc': return <CheckCircle className="w-4 h-4" />;
      case 'rejeitada': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleConnectionAction = (startupId: string, action: 'interesse' | 'convidar' | 'rejeitar') => {
    console.log(`Ação ${action} para startup ${startupId}`);
    // Aqui implementaria a lógica de conexão
  };

  const calculateProgress = () => {
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const now = new Date();
    
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <h1>Detalhes do Desafio</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Challenge Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle>{challenge.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{challenge.area}</Badge>
                      <Badge variant={challenge.type === 'publico' ? 'default' : 'secondary'}>
                        {challenge.type === 'publico' ? 'Público' : 'Interno'}
                      </Badge>
                      <Badge variant="outline">{challenge.company}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3>Descrição do Problema</h3>
                  <p className="text-muted-foreground mt-2">{challenge.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Data de Início: {new Date(challenge.startDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Data de Fim: {new Date(challenge.endDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Progresso do Desafio</Label>
                    <Progress value={calculateProgress()} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(calculateProgress())}% concluído
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas do Desafio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">23</div>
                    <p className="text-sm text-muted-foreground">Ideias Submetidas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4</div>
                    <p className="text-sm text-muted-foreground">Startups Interessadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <p className="text-sm text-muted-foreground">POCs Iniciadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">87%</div>
                    <p className="text-sm text-muted-foreground">Score Médio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Participantes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ver Submissões
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Relatório Detalhado
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('startup-database')}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Buscar Mais Startups
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Startups */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Recomendações Automáticas de Startups
              </CardTitle>
              <CardDescription>
                Startups compatíveis com este desafio baseadas em IA e histórico de matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedStartups.map((startup) => (
                  <div key={startup.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{startup.name}</h4>
                          <Badge variant="outline">{startup.segment}</Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {startup.matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{startup.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Estágio: {startup.stage}</span>
                          <span>Tecnologia: {startup.technology}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{startup.matchScore}%</div>
                        <p className="text-xs text-muted-foreground">Compatibilidade</p>
                      </div>
                    </div>

                    {/* Connection Workflow */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(startup.connectionStatus)}>
                          {getStatusIcon(startup.connectionStatus)}
                          <span className="ml-1">{getStatusLabel(startup.connectionStatus)}</span>
                        </Badge>
                        {startup.lastInteraction && (
                          <span className="text-xs text-muted-foreground">
                            Última interação: {new Date(startup.lastInteraction).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {startup.connectionStatus === 'nenhum' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleConnectionAction(startup.id, 'interesse')}
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Registrar Interesse
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleConnectionAction(startup.id, 'convidar')}
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Convidar para POC
                            </Button>
                          </>
                        )}
                        
                        {startup.connectionStatus === 'interesse' && (
                          <Button 
                            size="sm"
                            onClick={() => handleConnectionAction(startup.id, 'convidar')}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Convidar para POC
                          </Button>
                        )}
                        
                        {startup.connectionStatus === 'convidada' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Ver Histórico
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Iniciar POC
                            </Button>
                          </div>
                        )}
                        
                        {startup.connectionStatus === 'poc' && (
                          <Button variant="outline" size="sm">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Acompanhar POC
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}