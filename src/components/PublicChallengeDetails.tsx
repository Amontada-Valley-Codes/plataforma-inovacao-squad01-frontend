import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Briefcase, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Challenge } from '../app/context/UserContext'; // Reutilizamos a interface

// Mock de dados (numa app real, isto viria de uma API)
const mockChallengeDetail = {
    id: "challenge-02",
    companyName: "TechCorp Brasil",
    companyLogo: "/img/Ninna_com_fundo.png",
    name: "Sustentabilidade na Cadeia de Suprimentos",
    endDate: "2025-12-01",
    area: "GreenTech",
    description: "Buscamos soluções inovadoras e sustentáveis para otimizar toda a nossa cadeia de suprimentos, desde a aquisição de matéria-prima até a entrega ao cliente final. O objetivo é reduzir a pegada de carbono em 20% nos próximos 2 anos, melhorar a rastreabilidade de produtos e garantir conformidade com as novas regulações ambientais. As soluções podem envolver IoT, Blockchain, IA para otimização de rotas ou novos materiais para embalagens.",
};

export function PublicChallengeDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
       {/* Header Público */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Image src="/img/Ninna_logo.png" alt="Ninna Hub Logo" width={120} height={40} />
          <Button asChild>
            <Link href="/">Acessar Plataforma</Link>
          </Button>
        </div>
      </header>

       {/* Conteúdo Principal */}
      <main className="container mx-auto px-6 py-12">
        <Button asChild variant="outline" className="mb-8">
            <Link href="/desafios">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para todos os desafios
            </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-4">{mockChallengeDetail.area}</Badge>
                        <CardTitle className="text-3xl">{mockChallengeDetail.name}</CardTitle>
                        <div className="flex items-center gap-6 text-gray-500 pt-2">
                            <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {mockChallengeDetail.companyName}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Encerra em: {new Date(mockChallengeDetail.endDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-line">{mockChallengeDetail.description}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="sticky top-28">
                    <CardHeader>
                        <CardTitle>Interessado em Participar?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Se a sua startup tem uma solução para este desafio, gostaríamos de saber mais. Por favor, entre em contato com a equipa de inovação do hub.
                        </p>
                        <Button className="w-full">
                            Entrar em Contato
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}