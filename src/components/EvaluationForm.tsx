import React from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Check, Archive, ArrowRight } from 'lucide-react';

// Simulando a estrutura de uma ideia
interface Idea {
  id: string;
  stage: string;
  title: string;
  priority: string;
  author: string;
  comments: number;
  days: number;
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
        <DialogTitle>{idea.title}</DialogTitle>
        <DialogDescription>
          Avaliação da ideia submetida por {idea.author}.
        </DialogDescription>
        <div className="flex gap-2 pt-2">
          <Badge variant="outline">Prioridade: {idea.priority}</Badge>
          <Badge variant="secondary">Comentários: {idea.comments}</Badge>
        </div>
      </DialogHeader>
      
      <div className="py-6 space-y-6">
        <Separator />
        
        {/* Formulário de Pré-Triagem */}
        {isPreScreening && (
          <div className="space-y-4">
            <h4 className="font-semibold">Checklist de Pré-Triagem</h4>
            <div className="flex items-center space-x-2">
              <Checkbox id="alignment" />
              <Label htmlFor="alignment">Possui alinhamento estratégico com a empresa?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="innovative" />
              <Label htmlFor="innovative">A ideia tem potencial inovador?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="relevance" />
              <Label htmlFor="relevance">É relevante para o negócio atualmente?</Label>
            </div>
          </div>
        )}

        {/* Formulário de Triagem Detalhada */}
        {isDetailedScreening && (
          <div className="space-y-4">
            <h4 className="font-semibold">Análise Detalhada</h4>
            <div className="space-y-2">
              <Label htmlFor="viability">Análise de Viabilidade Técnica</Label>
              <Textarea id="viability" placeholder="Descreva a viabilidade técnica, tecnologias necessárias, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="impact">Análise de Impacto Financeiro</Label>
              <Textarea id="impact" placeholder="Descreva o potencial de retorno, custos estimados, etc." />
            </div>
             <div className="space-y-2">
              <Label htmlFor="risks">Análise de Riscos</Label>
              <Textarea id="risks" placeholder="Descreva os possíveis riscos de mercado, técnicos ou operacionais." />
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="sm:justify-between">
        <Button type="button" variant="destructive">
          <Archive className="w-4 h-4 mr-2" />
          Arquivar Ideia
        </Button>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
          <Button type="submit">
            Aprovar para próxima fase
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}