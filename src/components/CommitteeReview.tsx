// /plat_inovacao/src/components/CommitteeReview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Check, X, Send, ClipboardCheck, MessageSquare, CheckSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { User, Idea } from '../app/context/UserContext';
import { Sidebar } from './SideBar';
import api from '../lib/api';
import Loading from '../app/loading';

// Tipos para os dados que virão da API
interface Evaluation {
  id: string;
  evaluator: { name: string };
  comments: Comment[];
  criteria: { name: string; value: string }[];
  stage: 'PRE_TRIAGEM' | 'TRIAGEM_DETALHADA';
}

interface Comment {
  id: string;
  author: { name: string };
  text: string;
  createdAt: string;
}

interface IdeaForReview extends Idea {
  challengeTitle: string;
  evaluations: Evaluation[];
  discussionComments: Comment[];
}

interface CommitteeReviewProps {
  user: User;
}

interface PreScreeningCriteria {
  alignment: boolean;
  innovative: boolean;
  relevance: boolean;
}

interface DetailedScreeningCriteria {
  viability: string;
  impact: string;
  risks: string;
}

export function CommitteeReview({ user }: CommitteeReviewProps) {
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
  const [ideasForReview, setIdeasForReview] = useState<IdeaForReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState<{ [ideaId: string]: string }>({});

  async function fetchAndProcessData() {
    setIsLoading(true);
    try {
      // 1. Buscar todas as ideias e todas as avaliações em paralelo
      const [ideasResponse, evaluationsResponse] = await Promise.all([
        api.get('/idea'),
        api.get('/evaluations'),
      ]);

      const allIdeas: Idea[] = ideasResponse.data;
      const allEvaluations: any[] = evaluationsResponse.data;

      // 2. Filtrar apenas as ideias que estão na etapa de pré-triagem
      const preScreeningIdeas = allIdeas.filter(idea => idea.stage === 'PRE_TRIAGEM' || idea.stage === 'TRIAGEM_DETALHADA');

      // 3. Combinar os dados
      const enrichedIdeas = await Promise.all(
        preScreeningIdeas.map(async (idea) => {
          // ... (lógica existente para buscar avaliações e desafios)
          const relatedEvaluations = allEvaluations.filter(ev => ev.ideaId === idea.id);
          console.log('Avaliações relacionadas para a ideia', idea.id, ':', relatedEvaluations);
          let challengeTitle = 'Desafio não encontrado';
          try {
            const challengeResponse = await api.get(`/challenges/${idea.challengeId}`);
            challengeTitle = challengeResponse.data.name;
          } catch (e) {
            console.error(`Falha ao buscar desafio ${idea.challengeId}`);
          }

          // NOVO: Buscar os comentários de discussão da ideia
          let discussionComments: Comment[] = [];
          try {
            const commentsResponse = await api.get(`/comments/${idea.id}/IDEA`);
            discussionComments = commentsResponse.data.map((comment: any) => ({
              ...comment,
              createdAt: new Date(comment.createdAt).toLocaleString('pt-BR'),
            }));
          } catch (e) {
            console.error(`Falha ao buscar comentários para a ideia ${idea.id}`);
          }

          return {
            ...idea,
            challengeTitle,
            evaluations: relatedEvaluations,
            discussionComments, // <-- Adiciona os comentários ao objeto
          };
        })
      );

      setIdeasForReview(enrichedIdeas);
    } catch (error) {
      console.error("Falha ao carregar dados para revisão:", error);
    } finally {
      setIsLoading(false);
    }


  }

  useEffect(() => {
    fetchAndProcessData();
  }, []);

  const handleDecision = async (ideaId: string, decision: 'approve' | 'reject') => {
    const nextStage = decision === 'approve' ? 'IDEACAO' : 'GERACAO'; // Aprovado vai para Ideação, Rejeitado volta para Geração (ou outro status)

    try {
      await api.put(`/idea/${ideaId}`, { stage: nextStage });
      alert(`Ideia ${decision === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso!`);
      // Recarregar os dados para atualizar a lista
      fetchAndProcessData();
    } catch (error) {
      console.error(`Falha ao ${decision} a ideia:`, error);
      alert('Ocorreu um erro ao processar a sua decisão.');
    }
  };


  if (isLoading) {
    return <Loading />;
  }

  // /plat_inovacao/src/components/CommitteeReview.tsx

  const handlePostComment = async (ideaId: string) => {
    const commentText = newComment[ideaId];
    if (!commentText || !commentText.trim()) return;

    try {
      // Passo 1: Envia o novo comentário para o backend.
      // O backend deve retornar o comentário recém-criado.
      const response = await api.post('/comments', {
        text: commentText,
        commentableType: 'IDEA',
        commentableId: ideaId,
      });

      const newCommentFromServer = response.data;

      // Passo 2: Atualiza o estado localmente em vez de recarregar.
      setIdeasForReview(currentIdeas => {
        // Encontra a ideia correta e adiciona o novo comentário à sua lista
        return currentIdeas.map(idea => {
          if (idea.id === ideaId) {
            // Cria um novo objeto de comentário formatado para a UI
            const formattedNewComment: Comment = {
              id: newCommentFromServer.id,
              author: { name: user.name },
              text: newCommentFromServer.text,
              createdAt: new Date(newCommentFromServer.createdAt).toLocaleString('pt-BR'),
            };

            // Retorna a ideia atualizada com o novo comentário
            return {
              ...idea,
              discussionComments: [...idea.discussionComments, formattedNewComment],
            };
          }
          return idea; // Retorna as outras ideias sem modificação
        });
      });

      // Passo 3: Limpa o campo de texto daquela ideia específica
      setNewComment(prev => ({ ...prev, [ideaId]: '' }));

    } catch (error) {
      console.error('Falha ao publicar comentário:', error);
      alert('Não foi possível enviar o seu comentário.');
    }
  };

  const removeEvaluationById = (idea: IdeaForReview, evaluationId: string): IdeaForReview => {
    api.delete(`/evaluations/${evaluationId}`);
    return {
      ...idea,
      evaluations: idea.evaluations.filter(ev => ev.id !== evaluationId),
    };
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar theme={theme} user={user} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`bg-[#011677]  ${theme === 'dark' ? 'bg-gray-800' : 'border-b border-gray-200'}`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-white" />
              <h1 className="text-xl font-semibold text-white">Revisão do Comitê</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container mx-auto px-6 py-8 flex-1">
          <Card className={`shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <CardTitle className={`text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Ideias em Análise ({ideasForReview.length})</CardTitle>
              <CardDescription>Delibere sobre as ideias que passaram pela avaliação inicial.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {ideasForReview.map((idea) => (
                  <AccordionItem key={idea.id} value={idea.id}>
                    <AccordionTrigger className={`hover:bg-gray-100 px-4 py-2 rounded-md flex justify-between items-center cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                      <div className="text-left">
                        <p className={`font-semibold text-base text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{idea.title}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Do desafio: <span className="font-medium">{idea.challengeTitle}</span>
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">{idea.stage}</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-4 border-t">
                      {/* ... */}
                      <div className="space-y-6 mb-6">
                        <div className="space-y-4">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Pareceres dos Avaliadores:</h4>
                          {idea.evaluations.length > 0 ? (
                            idea.evaluations.map((evaluation) => {
                              // 💡 Lógica para transformar o array de critérios em um objeto fácil de usar
                              const criteriaObject = evaluation.criteria.reduce((acc, { name, value }) => {
                                acc[name] = value;
                                return acc;
                              }, {} as Record<string, string>);

                              const preScreening = evaluation.stage === 'PRE_TRIAGEM' ? (criteriaObject as unknown as PreScreeningCriteria) : null;
                              const detailedScreening = evaluation.stage === 'TRIAGEM_DETALHADA' ? (criteriaObject as unknown as DetailedScreeningCriteria) : null;
                              console.log(evaluation)
                              return (
                                <div key={evaluation.id} className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="w-8 h-8"><AvatarFallback>{evaluation.evaluator.name.charAt(0)}</AvatarFallback></Avatar>
                                    <div>
                                      <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{evaluation.evaluator.name}</p>
                                      <Badge variant="outline">{evaluation.stage === 'PRE_TRIAGEM' ? 'Pré-Triagem' : 'Triagem Detalhada'}</Badge>
                                    </div>
                                  </div>

                                  {/* 💡 Nova renderização baseada no objeto transformado */}
                                  <div className="pl-11 space-y-2">
                                    {evaluation.stage === 'PRE_TRIAGEM' && (
                                      <div className='space-y-1 text-sm'>
                                        <p className={preScreening.alignment ? 'text-green-600' : 'text-gray-500'}>Alinhamento Estratégico: {preScreening.alignment ? 'Sim' : 'Não'}</p>
                                        <p className={preScreening.innovative ? 'text-green-600' : 'text-gray-500'}>Potencial Inovador: {preScreening.innovative ? 'Sim' : 'Não'}</p>
                                        <p className={preScreening.relevance ? 'text-green-600' : 'text-gray-500'}>Relevância: {preScreening.relevance ? 'Sim' : 'Não'}</p>
                                      </div>
                                    )}
                                    {detailedScreening && (
                                      <div className='space-y-2 text-sm italic'>
                                        {detailedScreening.viability && <p className={`text-gray-600 dark:text-gray-300`}><span className='font-semibold not-italic'>Viabilidade:</span> "{detailedScreening.viability}"</p>}
                                        {detailedScreening.impact && <p className={`text-gray-600 dark:text-gray-300`}><span className='font-semibold not-italic'>Impacto:</span> "{detailedScreening.impact}"</p>}
                                        {detailedScreening.risks && <p className={`text-gray-600 dark:text-gray-300`}><span className='font-semibold not-italic'>Riscos:</span> "{detailedScreening.risks}"</p>}
                                      </div>
                                    )}
                                  </div>
                                  /
                              <button onClick={() => {
                                const updatedIdea = removeEvaluationById(idea, evaluation.id);
                                setIdeasForReview(prevIdeas => prevIdeas.map(i => i.id === updatedIdea.id ? updatedIdea : i));
                              }}>Remover Avaliação</button>
                                </div>
                              );
                              

                            })
                          ) : (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhuma avaliação ainda.</p>
                          )}
                        </div>



                        <Separator />

                        {/* --- INÍCIO DA NOVA SECÇÃO DE COMENTÁRIOS --- */}
                        <div className="space-y-4">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Discussão do Comitê</h4>

                          {/* Lista de comentários existentes */}
                          <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                            {idea.discussionComments.length > 0 ? (
                              idea.discussionComments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                  <Avatar className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}><AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback></Avatar>
                                  <div>
                                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{comment.author.name}</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{comment.text}</p>
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{comment.createdAt}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className={`text-sm text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum comentário na discussão ainda.</p>
                            )}
                          </div>

                          {/* Formulário para novo comentário */}
                          <div className="flex items-start gap-3 pt-4 border-t">
                            <Avatar className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="w-full space-y-2">
                              <Textarea
                                placeholder="Adicione seu parecer ou comentário..."
                                value={newComment[idea.id] || ''}
                                onChange={(e) => setNewComment(prev => ({ ...prev, [idea.id]: e.target.value }))}
                                className={`focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'}`}
                              />
                              <div className="flex justify-end">
                                <Button className={`${theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-500 transition-colors`} size="sm" onClick={() => handlePostComment(idea.id)}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Publicar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* --- FIM DA NOVA SECÇÃO --- */}

                        <Separator />

                        {/* Ações do Comitê */}
                        <div className="flex justify-end gap-4">
                          <Button variant="destructive" onClick={() => handleDecision(idea.id, 'reject')} className="bg-red-600 hover:bg-red-700 transition-all cursor-pointer">
                            <X className="w-4 h-4 mr-2" />
                            Rejeitar Ideia
                          </Button>
                          <Button onClick={() => handleDecision(idea.id, 'approve')} className="bg-green-600 hover:bg-green-700 text-white transition-all cursor-pointer">
                            <Check className="w-4 h-4 mr-2" />
                            Aprovar para Ideação
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}