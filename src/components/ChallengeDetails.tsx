import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
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
  TrendingUp,
  Paperclip
} from 'lucide-react';
import { User, Challenge, Startup } from '../app/context/UserContext';

interface ChallengeDetailsProps {
  user: User;
  challenge: Challenge;
  onNavigate: (page: 'dashboard' | 'startup-database') => void;
}

// Mock de dados para os comentários
const mockComments = [
  {
    id: 'c1',
    author: { name: 'Ana Silva', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2067&auto=format&fit=crop' },
    text: 'Achei a FinanceAI muito promissora. O match score de 95% é impressionante e a descrição alinha-se perfeitamente com o nosso objetivo de automação.',
    timestamp: '2 dias atrás',
  },
  {
    id: 'c2',
    author: { name: 'Carlos Santos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    text: 'Concordo com a Ana. Já solicitei uma demonstração com a FinanceAI. A SmartAudit também parece interessante, podemos avaliá-la como uma segunda opção?',
    timestamp: '1 dia atrás',
  },
  {
    id: 'c3',
    author: { name: 'Maria Costa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
    text: 'Ótima iniciativa, Carlos. Adicionei um anexo com a análise de mercado que fizemos no último trimestre, pode ajudar na avaliação. A ProcessBot, apesar de ter um score menor, usa RPA, que é uma tecnologia que já temos internamente.',
    timestamp: '3 horas atrás',
  },
];


export function ChallengeDetails({ user, challenge, onNavigate }: ChallengeDetailsProps) {
  const [selectedStartups, setSelectedStartups] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (newComment.trim()) {
      console.log('Novo comentário:', newComment);
      // Aqui, você adicionaria o comentário ao estado
      setNewComment('');
    }
  };


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
    <div className="min-h-screen " >
      {/* Header */}
      <div className="bg-card border-b border-border bg-[#011677] text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className='hover:bg-gray-300 cursor-pointer'
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <h1>Detalhes do Desafioo</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-fluid mx-auto px-6 py-8 bg-gray-100">
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
                <Button className="w-full justify-start hover:bg-gray-400" variant='outline'>
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

        {/* Tabs for Startups and Discussion */}
        <div className="mt-8">
          <Tabs defaultValue="startups">
            <TabsList className="mb-4">
              <TabsTrigger value="startups">
                <Star className="w-4 h-4 mr-2" />
                Startups Recomendadas
              </TabsTrigger>
              <TabsTrigger value="discussion">
                <MessageCircle className="w-4 h-4 mr-2" />
                Discussão Interna
              </TabsTrigger>
            </TabsList>

            <TabsContent value="startups">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Recomendações Automáticas
                  </CardTitle>
                  <CardDescription>
                    Startups compatíveis com este desafio baseadas em IA e histórico de matches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedStartups.map((startup) => (
                      <div key={startup.id} className="shadow-md rounded-lg p-4">
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
                                  className='bg-emerald-600 text-white hover:bg-emerald-700' 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleConnectionAction(startup.id, 'interesse')}
                                >
                                  <Heart className="w-4 h-4 mr-1" />
                                  Registrar Interesse
                                </Button>
                                <Button
                                  className='bg-blue-600 text-white hover:bg-blue-700'
                                  variant="outline" 
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
                                className='bg-blue-600 text-white hover:bg-blue-700'
                                variant="outline"
                                size="sm"
                                onClick={() => handleConnectionAction(startup.id, 'convidar')}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Convidar para POC
                              </Button>
                            )}
                            
                            {startup.connectionStatus === 'convidada' && (
                              <div className="flex gap-2">
                                <Button 
                                  className='bg-red-600 text-white hover:bg-red-700'
                                  variant="outline" size="sm">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Ver Histórico
                                </Button>
                                <Button 
                                  className='bg-green-600 text-white hover:bg-green-700' size="sm">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Iniciar POC
                                </Button>
                              </div>
                            )}
                            
                            {startup.connectionStatus === 'poc' && (
                              <Button className='bg-yellow-600 text-white hover:bg-yellow-700' variant="outline" size="sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                Acompanhar POC
                              </Button>
                            )}
                            
                            <Button className='bg-black text-white hover:bg-gray-700' variant="ghost" size="sm">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussion">
              <Card>
                <CardHeader>
                  <CardTitle>Discussão Interna</CardTitle>
                  <CardDescription>
                    Espaço para colaboradores discutirem o desafio, submissões e startups.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Post Comment */}
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2">
                      <Textarea 
                        placeholder="Adicione um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <Paperclip className="w-4 h-4 mr-2" />
                          Anexar
                        </Button>
                        <Button onClick={handlePostComment} size="sm">
                          <Send className="w-4 h-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  <div className="space-y-6">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{comment.author.name}</p>
                            <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}