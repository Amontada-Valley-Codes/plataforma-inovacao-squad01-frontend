import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User } from '../app/context/UserContext';

interface CompanyFormProps {
  user: User;
  onNavigate: (page: 'dashboard') => void;
}

export function CompanyForm({ user, onNavigate }: CompanyFormProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#001f61] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button className='hover:bg-[#002a7a] transition-colors duration-200 text-white' variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <h1>Cadastrar Nova Empresa</h1>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>Insira as informações da nova empresa que usará a plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input 
              id="company-name" 
              placeholder="Ex: Inova Corp"
              className='focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors' />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-cnpj">CNPJ</Label>
              <Input 
              id="company-cnpj" 
              placeholder="00.000.000/0001-00"
              className='focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors' />
            </div>

             <div className="space-y-2">
              <Label htmlFor="company-description">Descrição Breve</Label>
              <Textarea 
              id="company-description" 
              placeholder="Uma breve descrição sobre a empresa..."
              className='focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors' />

            </div>
            <Button className="w-full bg-[#001f61] hover:bg-[#002a7a] transition-colors text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Empresa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}