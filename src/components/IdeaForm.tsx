import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Lightbulb } from 'lucide-react';

interface IdeaFormProps {
  stageTitle: string;
  onSubmit: (data: { title: string, description: string }) => void; // 1. Receber a função onSubmit
}

export function IdeaForm({ stageTitle, onSubmit }: IdeaFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description }); // 3. Chamar a função recebida com os dados do formulário
    
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
              value={title} // Conectar estado
              onChange={(e) => setTitle(e.target.value)} // Conectar estado
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idea-description" className="text-gray-800">Descrição</Label>
            <Textarea 
              id="idea-description" 
              placeholder="Descreva a sua ideia em detalhe..." 
              className="border-[#001f61] focus:ring-[#7eb526] focus:border-[#7eb526] rounded-lg"
              value={description} // Conectar estado
              onChange={(e) => setDescription(e.target.value)} // Conectar estado
              required
            />
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
