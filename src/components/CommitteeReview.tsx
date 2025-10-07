import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Check, X, Send, ClipboardCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { User } from '../app/context/UserContext';
import { Sidebar } from './SideBar';
import { useState } from 'react';


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
      { author: { name: 'Ana Silva' }, text: 'Concordo, mas precisamos avaliar os custos de desenvolvimento. Parece um projeto grande para uma POC.' },
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
  const [theme, setTheme] = useState<string>(typeof window !== 'undefined' ? (sessionStorage.getItem('theme') || 'light') : 'light');
  return (
    <div className={`min-h-screen bg-gray-50 flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar sempre fixa e aberta */}
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
              <CardTitle className={`text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Ideias em Análise</CardTitle>
              <CardDescription className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Discuta e delibere sobre as seguintes ideias para decidir se avançam no funil de inovação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {mockIdeasForReview.map((idea) => (
                  <AccordionItem key={idea.id} value={idea.id}>
                    <AccordionTrigger className={`hover:bg-gray-100 px-4 py-2 rounded-md flex justify-between items-center cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                      <div className="text-left">
                        <p className={`font-semibold text-base text-[#001f61] ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{idea.title}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Submetida por: {idea.author}</p>
                      </div>
                      <div className="flex justify-center items-center">
                        <Badge
                          className={`px-5 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-300 cursor-pointer ${
                            idea.stage === 'pre-screening'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                          }`}
                        >
                          {idea.stage === 'pre-screening' ? 'Pré-Triagem' : 'Triagem Detalhada'}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-4 border-t">
                      <div className="space-y-6">
                        {/* Discussão */}
                        <div className="space-y-4">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Discussão do Comitê:</h4>
                          {idea.comments.map((comment, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Avatar className={`w-8 h-8 rounded-full bg-[#011677] text-white flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <AvatarFallback className="text-white">
                                  {comment.author.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{comment.author.name}</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Novo comentário */}
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8 rounded-full bg-[#011677] text-white flex items-center justify-center">
                            <AvatarFallback className="text-white">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="w-full space-y-2">
                            <Textarea className={` focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'focus:border-[#001f61]'}`} placeholder="Adicione seu parecer..." />
                            <div className="text-right">
                              <Button size="sm" className="bg-[#011677] hover:bg-[#001f61] text-white transition-all cursor-pointer">
                                <Send className="w-4 h-4 mr-2" />Publicar
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Botões de decisão */}
                        <div className="flex justify-end gap-4">
                          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 transition-all cursor-pointer">
                            <X className="w-4 h-4 mr-2" />
                            Rejeitar Ideia
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700 text-white transition-all cursor-pointer">
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