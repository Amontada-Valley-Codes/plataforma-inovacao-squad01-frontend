import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, Check, ThumbsUp, MessageCircle, X, Send, ClipboardCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { User } from '../app/context/UserContext';
import { Sidebar } from './SideBar';

interface CommitteeReviewProps {
  user: User;
}

const mockIdeasForReview = [
  {
    id: 'idea-3',
    title: 'Plataforma de Treinamento Gamificada',
    challengeTitle: 'Sustentabilidade na Cadeia de Suprimentos',
    stage: 'pre-screening',
    author: 'Maria Costa',
    comments: [
      { author: { name: 'Carlos Santos' }, text: 'A análise inicial de viabilidade é positiva. O potencial de engajamento é alto.' },
      { author: { name: 'Ana Silva' }, text: 'Concordo, mas precisamos de avaliar os custos de desenvolvimento. Parece um projeto grande para uma POC.' },
    ],
  },
  {
    id: 'idea-6',
    title: 'Análise Preditiva de Churn',
    challengeTitle: 'Automação de Processos Financeiros',
    stage: 'detailed-screening',
    author: 'Carlos Santos',
    comments: [
        { author: { name: 'Ana Silva' }, text: 'O impacto financeiro desta ideia é o maior de todos que avaliamos. A tecnologia necessária já existe na casa. Sou a favor de avançar.' },
    ],
  },
];

export function CommitteeReview({ user }: CommitteeReviewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-[#001f61]" />
              <h1 className="text-xl font-semibold text-gray-800">Revisão do Comitê</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container mx-auto px-6 py-8 flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Ideias em Análise</CardTitle>
              <CardDescription>
                Discuta e delibere sobre as seguintes ideias para decidir se avançam no funil de inovação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {mockIdeasForReview.map((idea) => (
                  <AccordionItem key={idea.id} value={idea.id}>
                    <AccordionTrigger className="hover:bg-gray-100 px-4 rounded-md">
                      <div className="text-left">
                        <p className="font-semibold text-base text-[#001f61]">{idea.title}</p>
                        <p className="text-sm text-gray-500">Submetida por: {idea.author}</p>
                      </div>
                      <Badge variant="outline">{idea.stage === 'pre-screening' ? 'Pré-Triagem' : 'Triagem Detalhada'}</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-4 border-t">
                      <div className="space-y-6">
                        {/* Seção de Discussão */}
                        <div className="space-y-4">
                          <h4 className="font-semibold">Discussão do Comitê:</h4>
                          {idea.comments.map((comment, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{comment.author.name}</p>
                                <p className="text-sm text-gray-600">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Formulário para novo comentário */}
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="w-full space-y-2">
                            <Textarea placeholder="Adicione seu parecer..." />
                            <div className='text-right'>
                               <Button size="sm"><Send className="w-4 h-4 mr-2" />Publicar</Button>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        {/* Botões de Decisão */}
                        <div className="flex justify-end gap-4">
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                <X className="w-4 h-4 mr-2" />
                                Rejeitar Ideia
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Check className="w-4 h-4 mr-2" />
                                Aprovar para Próxima Fase
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