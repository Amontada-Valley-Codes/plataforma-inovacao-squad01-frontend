// /plat_inovacao/src/components/EvaluationForm.tsx

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Check, Archive, ArrowRight } from 'lucide-react';
import { Idea, User } from '../app/context/UserContext'; // 1. Importar o tipo User
import api from '../lib/api'; // 2. Importar o axios

interface EvaluationFormProps {
  idea: Idea;
  user: User; // 3. Receber o usuário logado como prop
  onEvaluationComplete: () => void; // 4. Função para recarregar as ideias no funil
}

// Mapeamento dos stages do frontend para o backend
const stageMap = {
    'pre-screening': 'PRE_TRIAGEM',
    'detailed-screening': 'TRIAGEM_DETALHADA',
};

export function EvaluationForm({ idea, user, onEvaluationComplete }: EvaluationFormProps) {
  const isPreScreening = idea.stage === 'pre-screening';
  const isDetailedScreening = idea.stage === 'detailed-screening';

  // 5. Estados para controlar o formulário
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para os campos do formulário
  const [preScreeningCriteria, setPreScreeningCriteria] = useState({
    alignment: false,
    innovative: false,
    relevance: false,
  });
  const [detailedScreeningNotes, setDetailedScreeningNotes] = useState({
    viability: '',
    impact: '',
    risks: '',
  });

  const handleApprove = async () => {
    setIsLoading(true);
    setError('');

    try {
        // Passo A: Criar a Avaliação no backend
        const evaluationResponse = await api.post('/evaluations', {
            stage: stageMap[idea.stage as keyof typeof stageMap],
            ideaId: idea.id,
            evaluatorId: user.id,
        });
        const evaluationId = evaluationResponse.data.id;

        // Passo B: Criar os Comentários (se houver)
        if (isDetailedScreening) {
            const comments = [
                { title: 'Análise de Viabilidade', text: detailedScreeningNotes.viability },
                { title: 'Análise de Impacto', text: detailedScreeningNotes.impact },
                { title: 'Análise de Riscos', text: detailedScreeningNotes.risks },
            ];
            for (const comment of comments) {
                if (comment.text.trim()) {
                    await api.post('/comments', {
                        text: `${comment.title}: ${comment.text}`,
                        commentableType: 'IDEA',
                        commentableId: idea.id,
                        evaluationsId: evaluationId,
                    });
                }
            }
        }

        // Passo C: Mover a Ideia para a próxima etapa
        const nextStage = isPreScreening ? 'IDEACAO' : 'EXPERIMENTACAO';
        await api.put(`/idea/${idea.id}`, { stage: nextStage });

        alert('Avaliação enviada e ideia aprovada com sucesso!');
        onEvaluationComplete(); // Chama a função para fechar o modal e recarregar os dados no funil

    } catch (err: any) {
        console.error('Falha ao submeter avaliação:', err);
        setError(err.response?.data?.message || 'Ocorreu um erro.');
    } finally {
        setIsLoading(false);
    }
  };

  // Função para arquivar (rejeitar) a ideia
  const handleArchive = async () => {
     // ... implementação similar, mas movendo o stage para 'GERACAO' por exemplo
     alert('Função de arquivar ainda não implementada.');
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-[#001f61] font-bold">{idea.title}</DialogTitle>
        <DialogDescription>
          Avaliação da ideia submetida por <span className="font-semibold text-[#001f61]">{idea.authorId}</span>.
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
              <Checkbox 
                id="alignment" 
                className="border-[#001f61] text-[#7eb526]" 
                onCheckedChange={(checked) => setPreScreeningCriteria(prev => ({...prev, alignment: !!checked}))}
              />
              <Label htmlFor="alignment">Possui alinhamento estratégico?</Label>
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
              <Label htmlFor="viability">Análise de Viabilidade Técnica</Label>
              <Textarea 
                id="viability" 
                placeholder="Descreva a viabilidade técnica..." 
                value={detailedScreeningNotes.viability}
                onChange={(e) => setDetailedScreeningNotes(prev => ({...prev, viability: e.target.value}))}
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

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <DialogFooter className="sm:justify-between">
        <Button type="button" variant="destructive" onClick={handleArchive} disabled={isLoading}>
          <Archive className="w-4 h-4 mr-2" />
          Arquivar Ideia
        </Button>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Fechar</Button>
          </DialogClose>
          <Button onClick={handleApprove} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
            {isLoading ? 'A processar...' : (
                <>
                    Aprovar para próxima fase <ArrowRight className="w-4 h-4 ml-2" />
                </>
            )}
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}