// /plat_inovacao/src/components/EvaluationForm.tsx

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Check, Archive, Send } from 'lucide-react'; // Trocado ArrowRight por Send
import { Idea, User } from '../app/context/UserContext';
import api from '../lib/api';

interface EvaluationFormProps {
    idea: Idea;
    user: User;
    onEvaluationComplete: () => void;
}

const stageMap = {
    'pre-screening': 'PRE_TRIAGEM',
    'detailed-screening': 'TRIAGEM_DETALHADA',
};

export function EvaluationForm({ idea, user, onEvaluationComplete }: EvaluationFormProps) {
    const isPreScreening = idea.stage === 'pre-screening';
    const isDetailedScreening = idea.stage === 'detailed-screening';

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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

    // Função renomeada para refletir a nova ação
    const handleSubmitEvaluation = async () => {
        setIsLoading(true);
        setError('');

        try {
            // 💡 CORREÇÃO: Unificar a lógica de critérios
            // O payload de 'criteria' será preenchido dependendo da etapa da avaliação.
            const criteriaPayload = isPreScreening 
                ? preScreeningCriteria 
                : detailedScreeningNotes;

            // Passo A: Criar a Avaliação no backend, enviando os critérios corretos
            const evaluationResponse = await api.post('/evaluations', {
                stage: stageMap[idea.stage as keyof typeof stageMap],
                ideaId: idea.id,
                evaluatorId: user.id,
                criteria: criteriaPayload, // Envia o objeto com as notas da triagem detalhada
            });

            

            alert('Avaliação enviada com sucesso!');
            onEvaluationComplete(); // Fecha o modal e recarrega os dados

        } catch (err: any) {
            console.error('Falha ao submeter avaliação:', err);
            setError(err.response?.data?.message || 'Ocorreu um erro.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchive = async () => {
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
                
                {isPreScreening && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-[#001f61]">Checklist de Pré-Triagem</h4>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="alignment" className="border-[#001f61] text-[#7eb526]" onCheckedChange={(checked) => setPreScreeningCriteria(prev => ({ ...prev, alignment: !!checked }))} />
                            <Label htmlFor="alignment">Possui alinhamento estratégico?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="innovative" className="border-[#001f61] text-[#7eb526]" onCheckedChange={(checked) => setPreScreeningCriteria(prev => ({ ...prev, innovative: !!checked }))} />
                            <Label htmlFor="innovative" className="text-gray-800">A ideia tem potencial inovador?</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="relevance" className="border-[#001f61] text-[#7eb526]" onCheckedChange={(checked) => setPreScreeningCriteria(prev => ({ ...prev, relevance: !!checked }))} />
                            <Label htmlFor="relevance" className="text-gray-800">É relevante para o negócio atualmente?</Label>
                        </div>
                    </div>
                )}

                {isDetailedScreening && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-[#001f61]">Análise Detalhada</h4>
                        <div className="space-y-2">
                            <Label htmlFor="viability">Análise de Viabilidade Técnica</Label>
                            <Textarea id="viability" placeholder="Descreva a viabilidade técnica..." value={detailedScreeningNotes.viability} onChange={(e) => setDetailedScreeningNotes(prev => ({ ...prev, viability: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="impact" className="text-gray-800">Análise de Impacto Financeiro</Label>
                            <Textarea id="impact" placeholder="Descreva o potencial de retorno, custos estimados, etc." className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg" value={detailedScreeningNotes.impact} onChange={(e) => setDetailedScreeningNotes(prev => ({...prev, impact: e.target.value}))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="risks" className="text-gray-800">Análise de Riscos</Label>
                            <Textarea id="risks" placeholder="Descreva os possíveis riscos de mercado, técnicos ou operacionais." className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg" value={detailedScreeningNotes.risks} onChange={(e) => setDetailedScreeningNotes(prev => ({...prev, risks: e.target.value}))} />
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
                    {/* Botão atualizado */}
                    <Button onClick={handleSubmitEvaluation} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {isLoading ? 'A enviar...' : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Submeter Avaliação
                            </>
                        )}
                    </Button>
                </div>
            </DialogFooter>
        </div>
    );
}