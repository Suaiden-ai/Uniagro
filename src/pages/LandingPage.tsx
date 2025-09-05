import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Users, 
  Shield, 
  Globe, 
  Target, 
  CheckCircle, 
  MapPin, 
  Building2,
  Smartphone,
  Database,
  Lock,
  TrendingUp,
  Star,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [showStats, setShowStats] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Array de imagens do agronegócio
  const heroImages = [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Campo de trigo
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Plantação de milho
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Trator no campo
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Soja
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Timer para trocar imagens automaticamente
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Troca a cada 5 segundos
    
    // Intersection Observer para animações de seção
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    // Observar todas as seções
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      clearTimeout(timer);
      clearInterval(imageTimer);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [heroImages.length]);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const isSectionVisible = (id: string) => visibleSections.has(id);



  const features = [
    {
      icon: Database,
      title: "Banco de Dados Robusto",
      description: "Estrutura sólida com filtros por número, data e categoria, acessível via site e WhatsApp"
    },
    {
      icon: Smartphone,
      title: "Acesso via WhatsApp",
      description: "Cadastro simplificado através do WhatsApp, ideal para baixa conectividade rural"
    },
    {
      icon: Lock,
      title: "Privacidade e LGPD",
      description: "Dados sensíveis protegidos, com controle de acesso hierárquico e criptografia"
    },
    {
      icon: Users,
      title: "Cadastro Hierárquico",
      description: "Sistema organizacional: Nacional > Estadual > Municipal > Entidades > Agricultores"
    },
    {
      icon: TrendingUp,
      title: "Marketplace Integrado",
      description: "Plataforma completa para oferta de produtos e serviços, com compartilhamento via links e redes sociais"
    },
    {
      icon: Star,
      title: "Unicom - Criptomoeda",
      description: "Sistema de criptomoeda própria integrado para transações e engajamento da comunidade"
    }
  ];

  const benefits = [
    "Rede nacional de entidades e associações rurais",
    "Plataforma tecnológica integrada com IA",
    "Marketplace digital para produtos e serviços",
    "Sistema de pagamentos com criptomoeda Unicom",
    "Programas de sustentabilidade e bioeconomia",
    "Assistência técnica especializada",
    "Acesso facilitado via WhatsApp",
    "Segurança de dados e conformidade LGPD"
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <div className="transform transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/uniagro-logo.png" 
                  alt="Uniagro" 
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                asChild 
                size="sm" 
                className="hidden sm:inline-flex border-white/30 text-white bg-[#2E7D32]/90 hover:bg-[#2E7D32] hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <Link to="/login">Acessar Plataforma</Link>
              </Button>

            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Multiple Background Images with crossfade effect */}
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url("${image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: `translateY(${scrollY * 0.3}px)`, // Efeito parallax suave
              zIndex: index === currentImageIndex ? 1 : 0
            }}
          />
        ))}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/30 via-transparent to-[#66BB6A]/30 z-20"></div>
        
        {/* Pattern overlay for texture */}
        <div className="absolute inset-0 opacity-5 z-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><g fill='%23FFFFFF' fill-opacity='0.3' fill-rule='nonzero'><circle cx='30' cy='30' r='2'/></g></g></svg>")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        {/* Animated floating elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/5 blur-3xl z-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-[#A5D6A7]/10 blur-3xl z-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/3 blur-3xl z-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-3 h-3 transition-all duration-500 hover:scale-150 group ${
                index === currentImageIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              style={{
                boxShadow: index === currentImageIndex 
                  ? '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)' 
                  : 'none'
              }}
              aria-label={`Imagem ${index + 1}`}
            >
              {/* Efeito de onda quando ativo */}
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-white/30 animate-ping"></div>
              )}
            </button>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto relative z-50 text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Badge className="mb-8 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors duration-300 px-8 py-3 text-base font-medium backdrop-blur-md">
              OSCIP - Organização da Sociedade Civil de Interesse Público
            </Badge>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-12 leading-tight drop-shadow-2xl">
              UNIAGRO
              <span className="text-[#A5D6A7] block sm:inline"> BRASIL</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-16 max-w-5xl mx-auto px-4 leading-relaxed font-medium drop-shadow-lg">
              Organização da Sociedade Civil de Interesse Público (OSCIP) que atua na 
              <strong className="text-[#A5D6A7]"> articulação e desenvolvimento</strong> do agronegócio brasileiro 
              através de tecnologia e inovação.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button 
                size="lg" 
                asChild 
                className="bg-[#2E7D32] hover:bg-[#66BB6A] text-white text-xl px-12 py-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold backdrop-blur-sm border-0"
              >
                <Link to="/login">
                  Começar Agora
                  <ArrowRight className="ml-4 h-6 w-6" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-xl px-12 py-8 border-2 border-white/50 text-[#2E7D32] hover:bg-white hover:text-[#2E7D32] transition-all duration-300 font-semibold backdrop-blur-md"
              >
                Saiba Mais
                <ChevronDown className="ml-4 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about"
        ref={setSectionRef('about')}
        className={`py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden transition-all duration-1000 ${
          isSectionVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#A5D6A7]/5 transform skew-x-12 translate-x-1/2"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'><g fill='%23A5D6A7' fill-opacity='0.03' fill-rule='evenodd'><circle cx='10' cy='10' r='1'/><circle cx='30' cy='30' r='1'/></g></svg>")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#A5D6A7]/5 transform skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* SOBRE NÓS - Left Column */}
            <div className="space-y-8">
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-8 relative">
                  SOBRE NÓS
                  <div className="absolute -bottom-2 left-0 w-24 h-1 bg-[#2E7D32] rounded-full"></div>
                  <div className="absolute -bottom-2 left-0 w-16 h-1 bg-[#66BB6A] rounded-full"></div>
                </h2>
              </div>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg font-medium first-letter:text-6xl first-letter:font-bold first-letter:text-[#2E7D32] first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                  A UNIAGRO é uma organização da Sociedade Civil de interesse Público (OSCIP) que congrega entidades como: Associações, Sindicatos, Cooperativas, Institutos e Fundações que atuam no seguimento do Desenvolvimento Rural e a Agricultura Familiar dentro do território brasileiro.
                </p>
                
                <p className="text-lg">
                  A entidade se encontra organizada dentro dos 26 estados e o Distrito Federal a partir da sua rede de entidades afiliadas e contratadas para execução de programas e projetos para o cumprimento de seus objetivos sociais, promovendo o desenvolvimento rural sustentável.
                </p>
                
                <p className="text-lg">
                  Sua principal atuação é na articulação de mercado e a conciliação com a estratégia produtiva, fazendo com que haja uma otimização da capacidade da propriedade e do trabalho da família com base em demandas de mercados.
                </p>
                
                <p className="text-lg">
                  A UNIAGRO está se estruturando através das novas tecnologias da informação e de gerenciamento e de dados de sua base para proporcionar oportunidades de negócios para seus associados, bem como tem assumido um protagonismo e desenvolvimento estratégico rural das comunidades onde se encontram seus associados.
                </p>
                
                <p className="text-lg">
                  A sustentabilidade é foco central para atuação da UNIAGRO, onde seus programas e ofertas de parcerias tem desenvolvido projetos socioeconômicos voltados para bioeconomia, a transição energética, a estratégia global de descarbonização e diversas políticas de equilíbrio climático.
                </p>
                
                <div className="bg-[#A5D6A7]/10 border-l-4 border-[#2E7D32] p-6">
                  <p className="text-lg font-medium text-[#212121]">
                    Dentre sua principais estratégias de atuação está o Programa <strong className="text-[#2E7D32]">"Complexo Alimenta Brasil"</strong> que estrutura sua rede para um programa de segurança a alimentar nacional e internacional capaz de produzir oportunidades aos agricultores e garantia de abastecimento aos mercados.
                  </p>
                </div>
              </div>
            </div>

            {/* MISSÃO - Right Column */}
            <div className="flex flex-col items-center md:items-start space-y-8">
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-8 relative">
                  MISSÃO
                  <div className="absolute -bottom-2 left-0 w-24 h-1 bg-[#2E7D32] rounded-full"></div>
                  <div className="absolute -bottom-2 left-0 w-16 h-1 bg-[#66BB6A] rounded-full"></div>
                </h2>
              </div>
              <div className="bg-[#A5D6A7]/10 p-8 border border-[#A5D6A7]/20 backdrop-blur-sm">
                <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                  A missão da UNIAGRO é estabelecer uma condição de acesso dos agricultores do Brasil aos diversos mercados internos e externos que visam a segurança a alimentar da população mundial e existencia da população em um mundo ambientalmente equilibrado, saudável e socialmente justo.
                </p>
              </div>
              {/* Image of hands holding a plant */}
              <div className="w-full max-w-md md:max-w-none overflow-hidden shadow-2xl transform transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Mãos segurando uma planta jovem - sustentabilidade no agronegócio"
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features"
        ref={setSectionRef('features')}
        className={`py-24 bg-[#2E7D32] relative overflow-hidden transition-all duration-1000 delay-200 ${
          isSectionVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32] via-[#66BB6A] to-[#2E7D32] opacity-90"></div>
        <div className="absolute inset-0">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'><g fill='%23FFFFFF' fill-opacity='0.03' fill-rule='evenodd'><circle cx='20' cy='20' r='2'/><circle cx='60' cy='60' r='2'/></g></svg>")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Funcionalidades da Plataforma
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Desenvolvida para atender as necessidades específicas do agronegócio brasileiro, 
              com foco em usabilidade e acessibilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/95 backdrop-blur-sm hover:-translate-y-3 cursor-pointer overflow-hidden"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  opacity: isSectionVisible('features') ? 1 : 0,
                  transform: isSectionVisible('features') ? 'translateY(0)' : 'translateY(30px)'
                }}
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-[#A5D6A7]/20 flex items-center justify-center mb-6 group-hover:bg-[#2E7D32] transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-8 w-8 text-[#2E7D32] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#212121] group-hover:text-[#2E7D32] transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2E7D32] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section 
        id="marketplace"
        ref={setSectionRef('marketplace')}
        className={`py-24 bg-gray-50 relative overflow-hidden transition-all duration-1000 delay-300 ${
          isSectionVisible('marketplace') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><g fill='%23E0E0E0' fill-opacity='0.1'><polygon points='50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40'/></g></svg>")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6">
              Marketplace UNIAGRO
            </h2>
            <div className="w-24 h-1 bg-[#2E7D32] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Conecte, negocie e cresça com nossa plataforma integrada de comércio rural
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="bg-[#A5D6A7]/10 p-8 border border-[#A5D6A7]/20 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-[#212121] mb-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#2E7D32] flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span>Oferte e Negocie</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2E7D32] rounded-full mt-2"></div>
                    <p className="text-gray-700 font-medium">Agricultores e empresas podem ofertar produtos e serviços diretamente na plataforma</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2E7D32] rounded-full mt-2"></div>
                    <p className="text-gray-700 font-medium">Catálogo completo com descrições, preços e disponibilidade em tempo real</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2E7D32] rounded-full mt-2"></div>
                    <p className="text-gray-700 font-medium">Sistema de avaliações e feedback para garantir a qualidade das transações</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#2E7D32]/5 p-8 border border-[#2E7D32]/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-[#212121] mb-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#66BB6A] flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <span>Compartilhe Facilmente</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#66BB6A] rounded-full mt-2"></div>
                    <p className="text-gray-700 font-medium">Compartilhamento instantâneo via WhatsApp, Instagram e outras redes sociais</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#66BB6A] rounded-full mt-2"></div>
                    <p className="text-gray-700 font-medium">Links personalizados para cada oferta, facilitando o marketing digital</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#66BB6A] rounded-full mt-2"></div>
                    <p className="text-gray-700 font-medium">Campanhas automatizadas via IA para maximizar o alcance das ofertas</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="bg-[#2E7D32] text-white border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#66BB6A]/20 rounded-full -translate-y-16 translate-x-16"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                    <Star className="h-8 w-8" />
                    <span>Pagamentos Integrados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <h4 className="font-bold mb-2">Cartões Tradicionais</h4>
                      <p className="text-sm opacity-90">Aceite pagamentos via cartão de crédito e débito com segurança total</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                      <h4 className="font-bold mb-2">Criptomoeda Unicom</h4>
                      <p className="text-sm opacity-90">Sistema próprio de criptomoeda para transações dentro da comunidade UNIAGRO</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                      <h4 className="font-bold mb-2">IA para Engajamento</h4>
                      <p className="text-sm opacity-90">Algoritmos inteligentes para retenção de usuários e otimização de vendas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#A5D6A7]/20 p-6 text-center">
                  <div className="text-3xl font-bold text-[#2E7D32] mb-2">Ativo</div>
                  <div className="text-sm font-medium text-gray-600">Marketplace Digital</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#A5D6A7]/5 transform -skew-x-12 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6">
              Nossos Programas
            </h2>
            <div className="w-24 h-1 bg-[#2E7D32] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Programas estratégicos para o desenvolvimento rural e segurança alimentar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-2 overflow-hidden">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-[#A5D6A7]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-all duration-300">
                    <TrendingUp className="h-8 w-8 text-[#2E7D32] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#212121] group-hover:text-[#2E7D32] transition-colors duration-300">
                    Programa Renda Garantida
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-base mb-6 text-gray-600 leading-relaxed">
                  Iniciativa focada em parcerias estratégicas com empresas dos setores de energia renovável, 
                  sustentabilidade e tecnologia para fortalecer a renda rural.
                </CardDescription>
                <div className="space-y-3">
                  {[
                    'Identificação de famílias aptas para acessar mercados',
                    'Soluções em energia solar e mercado de carbono',
                    'Regularização fundiária',
                    'Acompanhamento e direcionamento de projetos'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-600">
                      <div className="w-2 h-2 bg-[#2E7D32] rounded-full"></div>
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2E7D32] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-2 overflow-hidden">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-[#A5D6A7]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-all duration-300">
                    <Globe className="h-8 w-8 text-[#2E7D32] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#212121] group-hover:text-[#2E7D32] transition-colors duration-300">
                    Complexo Alimenta Brasil
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <CardDescription className="text-base mb-6 text-gray-600 leading-relaxed">
                  Estratégia de relacionamento entre a rede UNIAGRO de entidades e seus associados 
                  para sistematizar estratégias de ocupação de mercados e produção articulada.
                </CardDescription>
                <div className="space-y-3">
                  {[
                    'Articulação de mercados internos e externos',
                    'Produção articulada para suprimento de demandas',
                    'Arranjos com parcerias públicas e privadas',
                    'Criação de ambientes de mercados seguros'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-600">
                      <div className="w-2 h-2 bg-[#2E7D32] rounded-full"></div>
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2E7D32] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-[#A5D6A7]/5 relative overflow-hidden">
        {/* Blur elements for depth */}
        <div className="absolute top-10 left-1/4 w-48 h-48 bg-[#2E7D32]/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-[#66BB6A]/5 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-8 relative">
                  Por que escolher a UNIAGRO?
                  <div className="absolute -bottom-2 left-0 w-24 h-1 bg-[#2E7D32]"></div>
                </h2>
              </div>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 group p-4 hover:bg-white/70 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-[#A5D6A7]/20 flex items-center justify-center group-hover:bg-[#2E7D32] transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-[#2E7D32] group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#2E7D32] p-10 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#66BB6A]/20 blur-xl -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#66BB6A]/20 blur-xl translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-8">Recursos Disponíveis</h3>
                  <div className="space-y-6">
                    {[
                      'Plataforma digital completa e funcional',
                      'Marketplace integrado e ativo',
                      'Sistema de pagamentos Unicom implementado',
                      'Inteligência artificial para otimização'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-4 group">
                        <div className="w-3 h-3 bg-white group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structure Section */}
      <section 
        id="structure"
        ref={setSectionRef('structure')}
        className={`py-24 bg-white relative overflow-hidden transition-all duration-1000 delay-400 ${
          isSectionVisible('structure') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'><g fill='%23F5F5F5' fill-opacity='0.3'><rect x='0' y='0' width='40' height='40'/><rect x='80' y='80' width='40' height='40'/></g></svg>")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6">
              Estrutura Organizacional
            </h2>
            <div className="w-24 h-1 bg-[#2E7D32] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Organização completa com secretarias especializadas e superintendências regionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-2 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center space-x-4 text-[#212121] group-hover:text-[#2E7D32] transition-colors duration-300">
                  <div className="w-12 h-12 bg-[#A5D6A7]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-all duration-300">
                    <Building2 className="h-6 w-6 text-[#2E7D32] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span>Secretarias Especializadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    'Secretaria Jurídica', 'Meio Ambiente e ESG', 'Educação', 'Saúde No Campo',
                    'Combate À Fome', 'Aquicultura e Pesca', 'Povos Originários', 'Comunidades Quilombolas',
                    'Combate À Pobreza', 'Mudanças Climáticas', 'Desenvolvimento Estratégico', 'Empreendedorismo',
                    'Crédito Rural', 'Turismo Rural', 'Economia Circular', 'E mais...'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#A5D6A7]/10 transition-colors duration-200">
                      <div className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full"></div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2E7D32] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:-translate-y-2 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center space-x-4 text-[#212121] group-hover:text-[#2E7D32] transition-colors duration-300">
                  <div className="w-12 h-12 bg-[#A5D6A7]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-all duration-300">
                    <MapPin className="h-6 w-6 text-[#2E7D32] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span>Superintendências Regionais</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    'Superintendência do Norte do Brasil',
                    'Superintendência do Nordeste do Brasil',
                    'Superintendência do Centro-oeste do Brasil',
                    'Superintendência do Sudeste do Brasil',
                    'Superintendência do Sul do Brasil'
                  ].map((region, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#A5D6A7]/10 transition-all duration-300 group">
                      <div className="w-4 h-4 bg-[#2E7D32] rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                      <span className="text-gray-700 font-medium">{region}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2E7D32] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta"
        ref={setSectionRef('cta')}
        className={`py-24 bg-[#2E7D32] relative overflow-hidden transition-all duration-1000 delay-500 ${
          isSectionVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><g fill='%2366BB6A' fill-opacity='0.1' fill-rule='evenodd'><circle cx='3' cy='3' r='1'/><circle cx='13' cy='13' r='1'/></g></svg>")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#66BB6A]/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#66BB6A]/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Pronto para fazer parte da revolução do agronegócio?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Cadastre-se agora e comece a construir o futuro da agricultura brasileira
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              asChild 
              className={`bg-white text-[#2E7D32] hover:bg-gray-100 text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold ${
                isSectionVisible('cta') ? '' : ''
              }`}
            >
              <Link to="/public">
                Cadastrar-se Agora
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-[#2E7D32] hover:bg-white hover:text-[#2E7D32] text-lg px-10 py-6 rounded-xl transition-all duration-300 font-semibold"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#212121] text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="transform transition-transform duration-300 group-hover:scale-105">
                  <img 
                    src="/uniagro-logo.png" 
                    alt="Uniagro" 
                    className="h-10 w-auto"
                  />
                </div>
                <span className="text-3xl font-bold text-white">UNIAGRO</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Plataforma digital que conecta o agronegócio brasileiro através de tecnologia, 
                inovação e desenvolvimento sustentável.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons placeholders */}
                <div className="w-10 h-10 bg-[#2E7D32]/20 rounded-full flex items-center justify-center hover:bg-[#2E7D32] transition-colors duration-300 cursor-pointer">
                  <div className="w-5 h-5 bg-[#2E7D32] rounded-sm"></div>
                </div>
                <div className="w-10 h-10 bg-[#2E7D32]/20 rounded-full flex items-center justify-center hover:bg-[#2E7D32] transition-colors duration-300 cursor-pointer">
                  <div className="w-5 h-5 bg-[#2E7D32] rounded-sm"></div>
                </div>
                <div className="w-10 h-10 bg-[#2E7D32]/20 rounded-full flex items-center justify-center hover:bg-[#2E7D32] transition-colors duration-300 cursor-pointer">
                  <div className="w-5 h-5 bg-[#2E7D32] rounded-sm"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-6 text-white relative">
                Plataforma
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#2E7D32] rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/public" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                    Cadastro
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/public" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                    Sobre
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-6 text-white relative">
                Contato
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#2E7D32] rounded-full"></div>
              </h3>
              <ul className="space-y-3 text-gray-400">
                <li className="font-medium">institucional@uniagro.com.br</li>
                <li className="font-medium">+1 (407) 533-3005</li>
                <li className="font-medium">Brasil - Nacional</li>
                <li className="font-medium">@uniagro.brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-medium">
              &copy; 2025 UNIAGRO Brasil. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;