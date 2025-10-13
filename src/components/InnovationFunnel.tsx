'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, GripVertical, Plus, User, Clock, MessageSquare, Target, ThumbsUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { User as UserType, Challenge, Idea as BaseIdea } from '../app/context/UserContext'; // Importe Challenge

// Extende o tipo Idea para incluir os campos adicionais usados localmente
type Idea = BaseIdea & {
  days: number;
  author: string;
  comments: number;
};
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { IdeaForm } from './IdeaForm';
import { EvaluationForm } from './EvaluationForm';
import { useRouter } from 'next/navigation';
import api from '../lib/api'; // 1. Importe o Axios
import Loading from '../app/loading'; // 2. Importe o Loading
import { useEffect } from 'react';

interface InnovationFunnelProps {
  user: UserType;
  challenge: Challenge; // Agora recebe o desafio inteiro
}

const stageMap: { [key: string]: Idea['stage'] } = {
  'capture': 'GERACAO',
  'pre-screening': 'PRE_TRIAGEM',
  'ideation': 'IDEACAO',
  'detailed-screening': 'TRIAGEM_DETALHADA',
  'poc': 'EXPERIMENTACAO'
};

// Mapeamento inverso
const reverseStageMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(stageMap).map(([key, value]) => [value, key])
);


export function InnovationFunnel({ user, challenge }: InnovationFunnelProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]); // 3. Estado para as ideias da API
  const [isLoading, setIsLoading] = useState(true);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]);
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const fetchIdeas = async () => { // <--- Mova a lógica para uma função reutilizável
    setIsLoading(true);
    // ... sua lógica de busca
    setIsLoading(false);
  };

  useEffect(() => {
    if (challenge.id) {
      fetchIdeas();
    }
  }, [challenge.id]);

  // 4. useEffect para buscar os dados
  useEffect(() => {
    const fetchIdeas = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/idea');
        // Filtra as ideias para mostrar apenas as do desafio atual
        const challengeIdeas = response.data
          .filter((idea: any) => idea.challengeId === challenge.id)
          .map((idea: any) => ({
            ...idea,
            // Converte o stage do backend (ex: "PRE_TRIAGEM") para o do frontend (ex: "pre-screening")
            stage: reverseStageMap[idea.stage] || 'capture',
            // Mocks para campos que não vêm da API
            author: 'Autor Desconhecido',
            comments: 0,
            days: Math.floor((new Date().getTime() - new Date(idea.createdAt).getTime()) / (1000 * 3600 * 24))
          }));

        setIdeas(challengeIdeas);
      } catch (error) {
        console.error("Falha ao buscar ideias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (challenge.id) {
      fetchIdeas();
    }
  }, [challenge.id]);

  // 5. Atualizar a função de Drag-and-Drop
  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Se o card mudou de coluna
    if (source.droppableId !== destination.droppableId) {
      const updatedIdeas = ideas.map(idea =>
        idea.id === draggableId ? { ...idea, stage: destination.droppableId } : idea
      );
      setIdeas(updatedIdeas); // Atualiza a UI imediatamente para feedback rápido

      const newStageBackend = stageMap[destination.droppableId]; // Converte para o formato do backend

      try {
        // Envia a atualização para a API
        await api.put(`/idea/${draggableId}`, { stage: newStageBackend });
      } catch (error) {
        console.error("Falha ao atualizar a etapa da ideia:", error);
        // Reverte a mudança na UI em caso de erro
        setIdeas(ideas);
        alert("Não foi possível mover a ideia. Tente novamente.");
      }
    }
  };

  // Funções auxiliares e de mock (ajustadas)
  const getPriorityBadge = (priority: string) => {
    const prio = priority?.toUpperCase();
    switch (prio) {
      case 'ALTA': return <Badge className="bg-orange-500 text-white">Alta</Badge>;
      case 'MEDIA': return <Badge className="bg-[#001f61] text-white">Média</Badge>;
      case 'BAIXA': return <Badge className="bg-[#7eb526] text-white">Baixa</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };
  const isEvaluationStage = (stageId: string) => stageId === 'pre-screening' || stageId === 'detailed-screening';


  // 6. Lógica de submissão do formulário de nova ideia
  const handleIdeaSubmit = async (formData: { title: string, description: string }) => {
    try {
      const newIdeaData = {
        title: formData.title,
        description: formData.description,
        challengeId: challenge.id,
        authorId: user.id,
        companyId: user.companyId,
        stage: 'GERACAO', // Sempre começa na primeira etapa
        priority: 'BAIXA', // Prioridade padrão
      };

      const response = await api.post('/idea', newIdeaData);

      // Adiciona a nova ideia à lista na UI
      const newIdeaForState = {
        ...response.data,
        stage: reverseStageMap[response.data.stage],
        author: user.name,
        comments: 0,
        days: 0,
      };
      setIdeas(prevIdeas => [...prevIdeas, newIdeaForState]);

      setIsIdeaFormOpen(false); // Fecha o modal
    } catch (error) {
      console.error('Falha ao criar ideia:', error);
      alert('Não foi possível criar a ideia. Tente novamente.');
    }
  };


  if (isLoading) {
    return <Loading />;
  }

  const funnelStages = [
    { id: 'capture', title: 'Geração/Captura' },
    { id: 'pre-screening', title: 'Pré-Triagem' },
    { id: 'ideation', title: 'Ideação' },
    { id: 'detailed-screening', title: 'Triagem Detalhada' },
    { id: 'poc', title: 'Experimentação (POC)' },
  ];

  const handleVote = (ideaId: string) => {
    setIdeas(ideas.map(idea =>
      idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
    ));
    setVotedIdeas([...votedIdeas, ideaId]);
  };


  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col`}>
      <div className={`bg-[#011677]  sticky top-0 z-10 text-white ${theme === 'dark' ? 'bg-gray-800 text-white' : ' text-black border-b border-gray-200'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost"
              size="sm"
              className="hovers-exit-dash text-white" onClick={() => router.push(`/challenges/${challenge.id}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Detalhes do Desafio
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <div>
                <h1 className="text-lg font-semibold">Funil de Ideias</h1>
                <p className="text-sm text-gray-300">{challenge.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-6 min-w-max h-full">
            {funnelStages.map(stage => (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-80 bg-white rounded-lg flex flex-col shadow-md border border-gray-200"
                  >
                    {/* Coluna Header */}
                    <div className={`p-4 bg-[#011677] rounded-t-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'text-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <span className="w-3 h-3 rounded-full bg-[#7eb526]"></span>
                          <h3 className="font-semibold">{stage.title}</h3>
                        </div>
                        <Badge className="bg-white text-[#001f61] font-semibold">
                          {ideas.filter(idea => idea.stage === stage.id).length}
                        </Badge>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {ideas.filter(idea => idea.stage === stage.id).map((idea, index) => (
                        <Draggable key={idea.id} draggableId={idea.id} index={index}>
                          {(provided, snapshot) => (
                            <Dialog open={isEvaluationModalOpen && selectedIdea?.id === idea.id} onOpenChange={(isOpen) => {
                                if (!isOpen) setSelectedIdea(null);
                                setIsEvaluationModalOpen(isOpen);
                            }}>
                              <DialogTrigger asChild onClick={() => setSelectedIdea(idea)}>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`shadow-md ${snapshot.isDragging ? 'opacity-80 shadow-lg' : ''}`}
                                >
                                  <Card className={`cursor-pointer active:cursor-grabbing bg-white hover:bg-gray-50 border-l-4 border-[#011677] hover:border-[#7eb526] transition-all ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : ''}`}>
                                    <CardHeader className="p-4">
                                      <div className="flex justify-between items-start">
                                        {getPriorityBadge(idea.priority)}
                                        <GripVertical className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                                      </div>
                                      <CardTitle className={`text-base mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-900'}`}>{idea.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end">
                                      <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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

                                      <Separator className="my-3" />
                                      <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                          <ThumbsUp className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-[#001f61]'}`} />
                                          <span>{idea.votes}</span>
                                        </div>
                                        <Button
                                          size="sm"
                                          className="bg-[#7eb526] text-white hover:bg-[#6aa21e]"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleVote(idea.id);
                                          }}
                                          disabled={votedIdeas.includes(idea.id)}
                                        >
                                          Apoiar
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </DialogTrigger>
                              {isEvaluationStage(idea.stage) && (
                                <DialogContent className="bg-white">
                                  {selectedIdea && (
                                      <EvaluationForm
                                          idea={selectedIdea}
                                          user={user}
                                          onEvaluationComplete={() => {
                                              setIsEvaluationModalOpen(false);
                                              setSelectedIdea(null);
                                              fetchIdeas(); // Recarrega
                                          }}
                                      />
                                  )}
                                </DialogContent>
                              )}
                            </Dialog>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {/* Adicionar ideia */}
                    <div className="p-4 mt-auto">
                      <Dialog open={isIdeaFormOpen} onOpenChange={setIsIdeaFormOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="w-full text-[#001f61] cursor-pointer hover:bg-gray-200">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Ideia
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <IdeaForm
                            stageTitle={stage.title}
                            onSubmit={handleIdeaSubmit} // Passar a nova função de submit
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}