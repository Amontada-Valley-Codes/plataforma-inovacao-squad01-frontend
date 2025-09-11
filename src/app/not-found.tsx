import Link from 'next/link';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg">
        {/* Ilustração */}
        <div className="flex justify-center">
          <Image 
            src="/img/404-notFound.jpg" 
            alt="Página não encontrada" 
            width={500} 
            height={500} 
          />
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Ops! Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant='outline'>
            <Link href="/dashboard" className='hover:bg-gray-300'>
              <Home className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className='hover:bg-gray-300'>
              <ArrowLeft className="w-4   h-4 mr-2" />
              Voltar ao Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
