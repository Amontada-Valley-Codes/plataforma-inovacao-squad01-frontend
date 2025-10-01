import React from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Check, Archive, ArrowRight } from 'lucide-react';

interface Idea {
  id: string;
  stage: string;
  title: string;
  priority: string;
  author: { name: string };
  comments: any[]; // Futuramente, para contagem de comentários
  createdAt: string;
  votes: number;
  evaluation?: { score: number; comments: string }; // Avaliação, se aplicável
}

interface EvaluationFormProps {
  idea: Idea;
}

export function EvaluationForm({ idea }: EvaluationFormProps) {
  const isPreScreening = idea.stage === 'pre-screening';
  const isDetailedScreening = idea.stage === 'detailed-screening';

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-[#001f61] font-bold">{idea.title}</DialogTitle>
        <DialogDescription>
          Avaliação da ideia submetida por <span className="font-semibold text-[#001f61]">{idea.author.name}</span>.
        </DialogDescription>
        <div className="flex gap-2 pt-2">
          <Badge className="bg-[#001f61] text-white">Prioridade: {idea.priority}</Badge>
          <Badge className="bg-[#7eb526] text-white">Comentários: {idea.comments}</Badge>
        </div>
      </DialogHeader>
      
      <div className="py-6 space-y-6">
        <Separator />
        
        {/* Formulário de Pré-Triagem */}
        {isPreScreening && (
          <div className="space-y-4">
            <h4 className="font-semibold text-[#001f61]">Checklist de Pré-Triagem</h4>
            <div className="flex items-center space-x-2">
              <Checkbox id="alignment" className="border-[#001f61] text-[#7eb526]" />
              <Label htmlFor="alignment" className="text-gray-800">Possui alinhamento estratégico com a empresa?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="innovative" className="border-[#001f61] text-[#7eb526]" />
              <Label htmlFor="innovative" className="text-gray-800">A ideia tem potencial inovador?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="relevance" className="border-[#001f61] text-[#7eb526]" />
              <Label htmlFor="relevance" className="text-gray-800">É relevante para o negócio atualmente?</Label>
            </div>
          </div>
        )}

        {/* Formulário de Triagem Detalhada */}
        {isDetailedScreening && (
          <div className="space-y-4">
            <h4 className="font-semibold text-[#001f61]">Análise Detalhada</h4>
            <div className="space-y-2">
              <Label htmlFor="viability" className="text-gray-800">Análise de Viabilidade Técnica</Label>
              <Textarea 
                id="viability" 
                placeholder="Descreva a viabilidade técnica, tecnologias necessárias, etc." 
                className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="impact" className="text-gray-800">Análise de Impacto Financeiro</Label>
              <Textarea 
                id="impact" 
                placeholder="Descreva o potencial de retorno, custos estimados, etc." 
                className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="risks" className="text-gray-800">Análise de Riscos</Label>
              <Textarea 
                id="risks" 
                placeholder="Descreva os possíveis riscos de mercado, técnicos ou operacionais." 
                className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="sm:justify-between">
        <Button type="button" variant="destructive" className="bg-red-600 hover:bg-red-700">
          <Archive className="w-4 h-4 mr-2" />
          Arquivar Ideia
        </Button>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-gray-200 text-[#001f61] hover:bg-gray-300">
              Fechar
            </Button>
          </DialogClose>
          <Button 
            type="submit"
            className="bg-[#7eb526] hover:bg-[#6aa21e] text-white"
          >
            Aprovar para próxima fase
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
