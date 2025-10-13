// /plat_inovacao/src/components/CommitteeReview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Check, X, Send, ClipboardCheck } from 'lucide-react';
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
  comments: { text: string }[];
  criteria: { name: string; value: boolean }[];
}

interface IdeaForReview extends Idea {
  challengeTitle: string;
  evaluations: Evaluation[];
}

interface CommitteeReviewProps {
  user: User;
}

export function CommitteeReview({ user }: CommitteeReviewProps) {
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
  const [ideasForReview, setIdeasForReview] = useState<IdeaForReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      const preScreeningIdeas = allIdeas.filter(idea => idea.stage === 'PRE_TRIAGEM');

      // 3. Combinar os dados
      const enrichedIdeas = await Promise.all(
        preScreeningIdeas.map(async (idea) => {
          // Encontrar as avaliações para esta ideia
          const relatedEvaluations = allEvaluations.filter(ev => ev.ideaId === idea.id);

          // Buscar o nome do desafio
          let challengeTitle = 'Desafio não encontrado';
          try {
            const challengeResponse = await api.get(`/challenges/${idea.challengeId}`);
            challengeTitle = challengeResponse.data.name;
          } catch (e) {
            console.error(`Falha ao buscar desafio ${idea.challengeId}`);
          }

          return {
            ...idea,
            challengeTitle,
            evaluations: relatedEvaluations,
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
                      <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">Pré-Triagem</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-4 border-t">
                      <div className="space-y-6">

                        {/* Seção de Avaliações */}
                        <div className="space-y-4">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Pareceres dos Avaliadores:</h4>
                          {idea.evaluations.length > 0 ? (
                            idea.evaluations.map((evaluation) => (
                              <div key={evaluation.id} className={`p-3 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                                  <div className="flex items-center gap-3 mb-2">
                                      <Avatar className="w-8 h-8"><AvatarFallback>{evaluation.evaluator.name.charAt(0)}</AvatarFallback></Avatar>
                                      <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{evaluation.evaluator.name}</p>
                                  </div>
                                  {evaluation.comments.map((comment, i) => (
                                     <p key={i} className={`text-sm italic pl-11 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>"{comment.text}"</p>
                                  ))}
                              </div>
                            ))
                          ) : (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhuma avaliação ainda.</p>
                          )}
                        </div>

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