const fs = require('fs');
const path = require('path');

// Lista dos componentes restantes
const remainingComponents = [
  'SaudeStep.tsx',
  'PropriedadeStep.tsx', 
  'InfraestruturaStep.tsx',
  'ProducaoStep.tsx',
  'ComunicacaoStep.tsx',
  'HabitacaoStep.tsx'
];

const componentsDir = path.join(__dirname, '..', 'src', 'components', 'form-steps');

remainingComponents.forEach(componentName => {
  const filePath = path.join(componentsDir, componentName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Adicionar CheckSquare ao import do lucide-react
    content = content.replace(
      /import { ([^}]+) } from 'lucide-react';/,
      (match, imports) => {
        if (!imports.includes('CheckSquare')) {
          return `import { ${imports}, CheckSquare } from 'lucide-react';`;
        }
        return match;
      }
    );
    
    // 2. Adicionar onFinish na interface
    content = content.replace(
      /interface (\w+StepProps) \{[^}]*onSave\?:[^}]*isFirst: boolean;\s*isLast: boolean;\s*\}/s,
      (match, interfaceName) => {
        return match.replace(
          'isLast: boolean;',
          'onFinish?: () => void;\n  isFirst: boolean;\n  isLast: boolean;'
        );
      }
    );
    
    // 3. Adicionar onFinish nos parâmetros da função
    content = content.replace(
      /export const (\w+Step) = \(\{ data, onNext, onPrevious, onSave, isFirst \}: (\w+StepProps)\) =>/,
      'export const $1 = ({ data, onNext, onPrevious, onSave, onFinish, isFirst, isLast }: $2) =>'
    );
    
    // 4. Atualizar a seção de botões
    content = content.replace(
      /<Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">\s+Próxima\s+<ArrowRight className="h-4 w-4 ml-2" \/>\s+<\/Button>/,
      `{isLast ? (
            <Button onClick={onFinish} className="bg-green-600 hover:bg-green-700">
              <CheckSquare className="h-4 w-4 mr-2" />
              Finalizar
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Atualizado: ${componentName}`);
  } else {
    console.log(`❌ Arquivo não encontrado: ${componentName}`);
  }
});

console.log('🎉 Atualização dos componentes restantes concluída!');
