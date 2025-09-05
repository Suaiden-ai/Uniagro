import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, CheckSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFormWrapperProps {
  children: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onFinish?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isSaving?: boolean;
  className?: string;
  showSave?: boolean;
}

export const MobileFormWrapper = ({
  children,
  onPrevious,
  onNext,
  onSave,
  onFinish,
  isFirst = false,
  isLast = false,
  isSaving = false,
  className = "",
  showSave = true
}: MobileFormWrapperProps) => {
  const isMobile = useIsMobile();

  // Função para lidar com o clique em "Próxima"
  const handleNext = async () => {
    if (onNext) {
      // Salvar automaticamente antes de avançar
      if (onSave) {
        await onSave();
      }
      onNext();
    }
  };

  // Função para lidar com o clique em "Finalizar"
  const handleFinish = async () => {
    if (onFinish) {
      // Salvar automaticamente antes de finalizar
      if (onSave) {
        await onSave();
      }
      onFinish();
    }
  };

  return (
    <div className={`space-y-4 md:space-y-6 max-w-full overflow-hidden ${className}`}>
      {/* Conteúdo do formulário */}
      <div className="space-y-4 md:space-y-6 px-2 md:px-0">
        {children}
      </div>

      {/* Botões de navegação responsivos */}
      <div className={`pt-4 md:pt-6 px-2 md:px-0 ${isMobile ? 'space-y-3' : 'flex justify-between items-center'}`}>
        {/* Botão Anterior */}
        {!isFirst && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className={`${isMobile ? 'w-full' : ''} touch-target`}
            size="default"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
        )}

        {/* Espaçador para quando não há botão anterior */}
        {isFirst && !isMobile && <div />}

        {/* Grupo de botões do lado direito */}
        <div className={`${isMobile ? 'space-y-3' : 'flex space-x-4'}`}>
          {/* Botão Salvar */}
          {showSave && onSave && (
            <Button
              variant="outline"
              onClick={onSave}
              disabled={isSaving}
              className={`${isMobile ? 'w-full' : ''} bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 touch-target`}
              size="default"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar informações'}
            </Button>
          )}

          {/* Botão Finalizar ou Próxima */}
          {isLast ? (
            onFinish && (
              <Button 
                onClick={handleFinish} 
                className={`${isMobile ? 'w-full' : ''} bg-green-600 hover:bg-green-700 touch-target`}
                size="default"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            )
          ) : (
            onNext && (
              <Button 
                onClick={handleNext} 
                className={`${isMobile ? 'w-full' : ''} bg-green-600 hover:bg-green-700 touch-target`}
                size="default"
              >
                Próxima
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};