'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, GripVertical, Plus, User, Clock, MessageSquare, Target, ThumbsUp, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { User as UserType, Challenge } from '../app/context/UserContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { IdeaForm } from './IdeaForm';
import { EvaluationForm } from './EvaluationForm';
import { useRouter } from 'next/navigation';
import { api } from '../service/Api';


interface InnovationFunnelProps {
  user: UserType;
  challenge: Challenge;
}

// Interface para corresponder ao que a API retorna (incluindo o autor)
interface Idea {
  id: string;
  stage: string;
  title: string;
  priority: string;
  author: string;
  comments: any[]; // Futuramente, para contagem de comentários
  createdAt: string;
  votes: number;
  evaluation?: { score: number; comments: string }; // Avaliação, se aplicável
  days: string;
}

const funnelStages = [
    { id: 'CAPTURE', title: 'Geração/Captura', color: 'bg-blue-500' },
    { id: 'PRE_SCREENING', title: 'Pré-Triagem', color: 'bg-purple-500' },
    { id: 'IDEATION', title: 'Ideação', color: 'bg-cyan-500' },
    { id: 'DETAILED_SCREENING', title: 'Triagem Detalhada', color: 'bg-yellow-500' },
    { id: 'POC', title: 'Experimentação (POC)', color: 'bg-green-500' },
];

export function InnovationFunnel({ user, challenge }: InnovationFunnelProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]); // IDs das ideias que o utilizador já votou

  const fetchIdeas = async () => {
    if (!challenge?.id) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/ideas/challenge/${challenge.id}`);
      setIdeas(response.data);
    } catch (error) {
      console.error("Erro ao buscar ideias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [challenge]);

  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId)) return;

    const originalIdeas = [...ideas];
    const updatedIdeas = ideas.map(idea => 
      idea.id === draggableId ? { ...idea, stage: destination.droppableId } : idea
    );
    setIdeas(updatedIdeas);

    try {
      await api.patch(`/ideas/${draggableId}/stage`, { stage: destination.droppableId });
    } catch (error) {
      console.error("Erro ao atualizar a etapa da ideia:", error);
      setIdeas(originalIdeas); // Reverte em caso de erro
      alert("Não foi possível mover a ideia.");
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Alta': return <Badge className="bg-orange-500">Alta</Badge>;
      case 'Média': return <Badge variant="secondary">Média</Badge>;
      case 'Baixa': return <Badge variant="outline">Baixa</Badge>;
      case 'Crítica': return <Badge variant="destructive">Crítica</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };
  
  const isEvaluationStage = (stageId: string) => stageId === 'PRE_SCREENING' || stageId === 'DETAILED_SCREENING';

  const handleVote = (ideaId: string) => {
		setIdeas(ideas.map(idea =>
			idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
		));
		setVotedIdeas([...votedIdeas, ideaId]);
	};

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando funil...</div>;
  }

 return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-[#011677] border-b border-gray-200 sticky top-0 z-10 text-white">
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
										<div className="p-4 bg-[#011677] rounded-t-lg">
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
														<Dialog>
															<DialogTrigger asChild>
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	className={`shadow-md ${snapshot.isDragging ? 'opacity-80 shadow-lg' : ''}`}
																>
																	<Card className="cursor-pointer active:cursor-grabbing bg-white hover:bg-gray-50 border-l-4 border-[#011677] hover:border-[#7eb526] transition-all">
																		<CardHeader className="p-4">
																			<div className="flex justify-between items-start">
																				{getPriorityBadge(idea.priority)}
																				<GripVertical className="w-4 h-4 text-gray-400" />
																			</div>
																			<CardTitle className="text-base mt-2 text-gray-900">{idea.title}</CardTitle>
																		</CardHeader>
																		<CardContent className="p-4 pt-0 flex-1 flex flex-col justify-end">
																			<div className="flex items-center justify-between text-xs text-gray-500">
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
																				<div className="flex items-center gap-1 text-sm text-gray-600">
																					<ThumbsUp className="w-4 h-4 text-[#001f61]" />
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
																	<IdeaForm 
																		stageTitle={stage.title} 
																		challengeId={challenge.id}
																		onIdeaCreated={fetchIdeas} 
																		closeDialog={() => setIsIdeaFormOpen(false)}
																	/>
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
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="ghost" className="w-full text-[#001f61] cursor-pointer hover:bg-gray-200">
														<Plus className="w-4 h-4 mr-2" />
														Adicionar Ideia
													</Button>
												</DialogTrigger>
												<DialogContent className="bg-white">
													<IdeaForm 
														stageTitle={stage.title} 
														challengeId={challenge.id}
														onIdeaCreated={fetchIdeas} 
														closeDialog={() => setIsIdeaFormOpen(false)}
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