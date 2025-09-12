import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Lightbulb } from 'lucide-react';

interface IdeaFormProps {
  stageTitle: string;
}

export function IdeaForm({ stageTitle }: IdeaFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para salvar a nova ideia seria adicionada aqui
    console.log('Nova ideia submetida!');
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Submeter Nova Ideia
        </DialogTitle>
        <DialogDescription>
          Descreva a sua ideia ou oportunidade. Ela será adicionada à coluna "{stageTitle}".
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="idea-title">Título da Ideia</Label>
            <Input id="idea-title" placeholder="Ex: App de Recomendações com IA" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idea-description">Descrição</Label>
            <Textarea id="idea-description" placeholder="Descreva a sua ideia em detalhe..." />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">
            Submeter Ideia
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}