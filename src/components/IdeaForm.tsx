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
   const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("theme") || "light"
      : "light"
  );


  return (
    <div>
      <DialogHeader>
        <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white': 'text-[#011677]'} font-bold`}>
          <Lightbulb className={` ${theme === 'dark' ? 'text-white': 'text-[#011677]'} w-5 h-5`}/>
          Submeter Nova Ideia
        </DialogTitle>
        <DialogDescription className={`${theme === 'dark' ? 'text-white': ''}`}>
          Descreva a sua ideia ou oportunidade. Ela será adicionada à coluna 
          <span className={`font-semibold ${theme === 'dark' ? 'text-white': ''}`}> "{stageTitle}"</span>.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="idea-title" className={`${theme === 'dark' ? 'text-white' : ''}`}>Título da Ideia</Label>
            <Input 
              id="idea-title" 
              placeholder="Ex: App de Recomendações com IA" 
              className={` ${theme === 'dark' ? 'border-[white] focus:ring-[white]  placeholder:text-white text-white' : ''} rounded-lg`}
              value={title} // Conectar estado
              onChange={(e) => setTitle(e.target.value)} // Conectar estado
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idea-description" className={`${theme === 'dark' ? 'text-white' : ''}`}>Descrição</Label>
            <Textarea 
              id="idea-description" 
              placeholder="Descreva a sua ideia em detalhe..." 
              className={` ${theme === 'dark' ? 'border-[white] focus:ring-[white] focus:border-[white] placeholder:text-white text-white' : ''} rounded-lg`}
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
              className={`bg-red-600 hover:bg-red-700 text-white`}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="submit"
            className="bg-[#011677] hover:bg-[#0121af] text-white"
          >
            Submeter Ideia
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}
