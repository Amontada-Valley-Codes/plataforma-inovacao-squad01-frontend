import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Lightbulb } from 'lucide-react';
import { useUser } from '../app/context/UserContext';
import { api } from '../service/Api';// Certifique-se que o caminho para sua api está correto
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface IdeaFormProps {
  stageTitle: string;
  onIdeaCreated: () => void; 
  challengeId: string; 
  closeDialog: () => void;
}

export function IdeaForm({ stageTitle, onIdeaCreated, challengeId, closeDialog }: IdeaFormProps) {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Média');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !user) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    console.log({ title, description, priority, authorId: user.sub, companyId: user.companyId, challengeId });
    try {
      await api.post('/ideas', {
        title,
        description,
        priority,
        authorId: user.sub,         // ID do utilizador que está a criar
        companyId: user.companyId, // ID da empresa do utilizador
        challengeId: challengeId,  // ID do desafio a que a ideia pertence
      });

      alert('Ideia submetida com sucesso!');
      onIdeaCreated(); // Atualiza a lista no funil
      closeDialog();   // Fecha o modal

    } catch (error) {
      console.error("Erro ao submeter ideia:", error);
      alert("Não foi possível submeter a ideia. Verifique a consola para mais detalhes.");
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-[#001f61] font-bold">
          <Lightbulb className="w-5 h-5 text-[#7eb526]" />
          Submeter Nova Ideia
        </DialogTitle>
        <DialogDescription>
          Descreva a sua ideia ou oportunidade. Ela será adicionada à coluna 
          <span className="font-semibold text-[#001f61]"> "{stageTitle}"</span>.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="idea-title" className="text-gray-800">Título da Ideia</Label>
            <Input 
              id="idea-title" 
              placeholder="Ex: App de Recomendações com IA" 
              className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idea-description" className="text-gray-800">Descrição</Label>
            <Textarea 
              id="idea-description" 
              placeholder="Descreva a sua ideia em detalhe..." 
              className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-gray-800">Prioridade</Label>
             <Select onValueChange={setPriority} defaultValue={priority}>
                <SelectTrigger className="focus:ring-[#001f61]/30">
                    <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Crítica">Crítica</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="secondary" 
              className="bg-gray-200 text-[#001f61] hover:bg-gray-300"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="submit"
            className="bg-[#7eb526] hover:bg-[#6aa21e] text-white"
          >
            Submeter Ideia
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}