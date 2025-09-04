import { useState } from 'react';
import { SinglePageForm } from '@/components/SinglePageForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Shield, Clock } from 'lucide-react';
import { isEmbedMode } from '@/hooks/use-embed';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const embedMode = isEmbedMode();

  if (showForm) {
    return <SinglePageForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className={`
      ${embedMode ? 'bg-white' : 'min-h-screen bg-gradient-to-b from-green-50 to-white'} 
      flex items-center justify-center p-4
    `}>
      <div className="max-w-4xl w-full">
        {/* Header com Logo */}
        <div className="text-center mb-8">
          <img 
            src="/uniagro-logo.png" 
            alt="Uniagro" 
            className={`mx-auto mb-4 ${embedMode ? 'h-12' : 'h-16'} w-auto`}
          />
          <h1 className={`font-bold text-green-800 mb-2 ${embedMode ? 'text-2xl' : 'text-4xl'}`}>
            Bem-vindo ao Uniagro
          </h1>
          <p className={`text-green-600 ${embedMode ? 'text-base' : 'text-xl'}`}>
            Cadastre-se e faça parte do futuro do agronegócio
          </p>
        </div>

        {/* Card Principal */}
        <Card className="shadow-xl border-green-200">
          <CardHeader className="text-center bg-green-50">
            <CardTitle className={`text-green-800 ${embedMode ? 'text-xl' : 'text-2xl'}`}>
              Questionário de Cadastro
            </CardTitle>
            <CardDescription className={`text-green-600 ${embedMode ? 'text-sm' : 'text-base'}`}>
              Precisamos conhecer melhor seu perfil para oferecer as melhores soluções
            </CardDescription>
          </CardHeader>
          <CardContent className={embedMode ? 'p-6' : 'p-8'}>
            {/* Benefícios */}
            <div className={`grid gap-6 mb-8 ${embedMode ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Cadastro Rápido</h3>
                  <p className="text-gray-600 text-sm">
                    Processo simples e intuitivo que leva apenas alguns minutos
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Dados Seguros</h3>
                  <p className="text-gray-600 text-sm">
                    Suas informações são protegidas e utilizadas com total segurança
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Comunidade</h3>
                  <p className="text-gray-600 text-sm">
                    Conecte-se com outros produtores e profissionais do agro
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Tempo Estimado</h3>
                  <p className="text-gray-600 text-sm">
                    Aproximadamente 5-7 minutos para concluir o cadastro
                  </p>
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="text-center">
              <Button 
                onClick={() => setShowForm(true)}
                size="lg"
                className={`bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg ${
                  embedMode ? 'px-6 py-2 text-base' : 'px-8 py-3 text-lg'
                }`}
              >
                Iniciar Questionário
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Ao continuar, você concorda com nossos termos de uso e política de privacidade
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        {!embedMode && (
          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>© 2025 Uniagro. Todos os direitos reservados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
