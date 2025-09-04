import { useState } from 'react';
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

  const stats = [
    { label: "Estados Atendidos", value: "26 + DF", icon: MapPin },
    { label: "Agricultores Filiados", value: "200K+", icon: Users },
    { label: "Entidades Afiliadas", value: "200+", icon: Building2 },
    { label: "Programas Ativos", value: "15+", icon: Target }
  ];

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
      title: "Marketplace Futuro",
      description: "Plataforma para oferta de produtos e serviços com integração de pagamentos"
    },
    {
      icon: Star,
      title: "Unicom - Criptomoeda",
      description: "Sistema de criptomoeda própria para transações e engajamento da comunidade"
    }
  ];

  const benefits = [
    "Rede de mais de 200 mil agricultores filiados",
    "Articulação de mercados internos e externos",
    "Programas de sustentabilidade e bioeconomia",
    "Soluções em energia solar e mercado de carbono",
    "Regularização fundiária e assistência técnica",
    "Criação de ambientes de mercados seguros"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/uniagro-logo.png" 
                alt="Uniagro" 
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-green-800">UNIAGRO</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="outline" asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Acessar Plataforma</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700" size="sm">
                <Link to="/public">Cadastrar-se</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              OSCIP - Organização da Sociedade Civil de Interesse Público
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              UNIAGRO
              <span className="text-green-600"> BRASIL</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto px-4">
              Organização da Sociedade Civil de Interesse Público (OSCIP) que congrega mais de 
              <strong> 200 mil agricultores</strong> em todo o território brasileiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                <Link to="/public">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Saiba Mais
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* SOBRE NÓS - Left Column */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-b-4 border-green-600 pb-2 inline-block">
                SOBRE NÓS
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  A UNIAGRO é uma organização da Sociedade Civil de interesse Público (OSCIP) que congrega entidades como: Associações, Sindicatos, Cooperativas, Institutos e Fundações que atuam no seguimento do Desenvolvimento Rural e a Agricultura Familiar dentro do território brasileiro.
                </p>
                
                <p className="text-lg">
                  A entidade se encontra organizada dentro dos 26 estados e o Distrito Federal a partir da sua rede de entidades afiliadas e contratadas para e execução de programas e projetos para o cumprimento de seus objetivos sociais, compreendendo atualmente a congregação de mais de 200 mil agricultores filiados a estas entidades.
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
                
                <p className="text-lg">
                  Dentre sua principais estratégias de atuação está o Programa <strong>"Complexo Alimenta Brasil"</strong> que estrutura sua rede para um programa de segurança a alimentar nacional e internacional capaz de produzir oportunidades aos agricultores e garantia de abastecimento aos mercados.
                </p>
              </div>
            </div>

            {/* MISSÃO - Right Column */}
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-b-4 border-green-600 pb-2 inline-block">
                MISSÃO
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                A missão da UNIAGRO é estabelecer uma condição de acesso dos agricultores do Brasil aos diversos mercados internos e externos que visam a segurança a alimentar da população mundial e existencia da população em um mundo ambientalmente equilibrado, saudável e socialmente justo.
              </p>
              {/* Image of hands holding a plant */}
              <div className="w-full max-w-md md:max-w-none rounded-full overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1509099836639-ce7109b4c4f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Mãos segurando uma planta jovem"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades da Plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvida para atender as necessidades específicas do agronegócio brasileiro, 
              com foco em usabilidade e acessibilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Programas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Programas estratégicos para o desenvolvimento rural e segurança alimentar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Programa Renda Garantida</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Iniciativa em parceria com empresas do setor de Energia Solar, Mercado de Carbono, 
                  regularização fundiária e outras soluções para a população rural.
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Identificação de famílias aptas para acessar mercados</li>
                  <li>• Soluções em energia solar e mercado de carbono</li>
                  <li>• Regularização fundiária</li>
                  <li>• Acompanhamento e direcionamento de projetos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Complexo Alimenta Brasil</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Estratégia de relacionamento entre a rede UNIAGRO de entidades e seus associados 
                  para sistematizar estratégias de ocupação de mercados e produção articulada.
                </CardDescription>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Articulação de mercados internos e externos</li>
                  <li>• Produção articulada para suprimento de demandas</li>
                  <li>• Arranjos com parcerias públicas e privadas</li>
                  <li>• Criação de ambientes de mercados seguros</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Por que escolher a UNIAGRO?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Próximos Passos</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Banco de dados funcional até julho/2025</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Apresentação em eventos internacionais</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Marketplace simplificado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Integração com criptomoeda Unicom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structure Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Estrutura Organizacional
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Organização completa com secretarias especializadas e superintendências regionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-green-600" />
                  <span>Secretarias Especializadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Secretaria Jurídica</div>
                  <div>• Meio Ambiente e ESG</div>
                  <div>• Educação</div>
                  <div>• Saúde No Campo</div>
                  <div>• Combate À Fome</div>
                  <div>• Aquicultura e Pesca</div>
                  <div>• Povos Originários</div>
                  <div>• Comunidades Quilombolas</div>
                  <div>• Combate À Pobreza</div>
                  <div>• Mudanças Climáticas</div>
                  <div>• Desenvolvimento Estratégico</div>
                  <div>• Empreendedorismo</div>
                  <div>• Crédito Rural</div>
                  <div>• Turismo Rural</div>
                  <div>• Economia Circular</div>
                  <div>• E mais...</div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-green-600" />
                  <span>Superintendências Regionais</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Superintendência do Norte do Brasil</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Superintendência do Nordeste do Brasil</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Superintendência do Centro-oeste do Brasil</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Superintendência do Sudeste do Brasil</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Superintendência do Sul do Brasil</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para fazer parte da revolução do agronegócio?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Cadastre-se agora e comece a construir o futuro da agricultura brasileira
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Link to="/public">
                Cadastrar-se Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/uniagro-logo.png" 
                  alt="Uniagro" 
                  className="h-8 w-auto"
                />
                <span className="text-2xl font-bold">UNIAGRO</span>
              </div>
              <p className="text-gray-400 mb-4">
                Conectando o Brasil Rural através da tecnologia e inovação. 
                A maior rede de agricultores, entidades e empresas do país.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/public" className="hover:text-white">Cadastro</Link></li>
                <li><Link to="/public" className="hover:text-white">Login</Link></li>
                <li><Link to="/public" className="hover:text-white">Sobre</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>institucional@uniagro.com.br</li>
                <li>+1 (407) 533-3005</li>
                <li>Brasil - Nacional</li>
                <li>@uniagro.brasil</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 UNIAGRO Brasil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
