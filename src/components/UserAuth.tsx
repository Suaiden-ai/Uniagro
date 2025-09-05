import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Mail, User, LogIn, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const UserAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp, user } = useUserAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação antes de fazer login.');
      } else {
        setError('Email ou senha incorretos');
      }
    } else {
      // Login bem-sucedido - redirecionar para a página principal
      navigate('/');
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email já está cadastrado');
      } else {
        setError('Erro ao criar conta. Verifique os dados e tente novamente.');
      }
    } else {
      setSuccess('Conta criada com sucesso! Verifique seu email e clique no link de confirmação para ativar sua conta antes de fazer login.');
      // Limpar campos
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/uniagro-logo.png" 
            alt="Uniagro" 
            className="mx-auto h-16 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-green-800">Uniagro</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Acesso do Usuário</CardTitle>
            <CardDescription>Entre ou cadastre-se para responder o questionário</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="mobile-tabs mb-6">
                <TabsTrigger 
                  value="login" 
                  className="mobile-tab-trigger"
                >
                  <LogIn />
                  <span>Entrar</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="mobile-tab-trigger"
                >
                  <UserPlus />
                  <span>Cadastrar</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant={error.includes('Email não confirmado') ? 'default' : 'destructive'} 
                           className={error.includes('Email não confirmado') ? 'border-amber-200 bg-amber-50' : ''}>
                      {error.includes('Email não confirmado') ? (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription className={error.includes('Email não confirmado') ? 'text-amber-800' : ''}>
                        {error.includes('Email não confirmado') ? (
                          <div className="space-y-2">
                            <p className="font-medium">Email não confirmado</p>
                            <div className="flex items-start space-x-2">
                              <Mail className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <p>Verifique sua caixa de entrada e clique no link de confirmação antes de fazer login.</p>
                                <p className="text-amber-700 mt-1">Se não recebeu o email, verifique também a pasta de spam.</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          error
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Digite seu email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Digite sua senha"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <div className="space-y-2">
                          <p className="font-medium">Conta criada com sucesso!</p>
                          <div className="flex items-start space-x-2">
                            <Mail className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p>Verifique seu email e clique no link de confirmação para ativar sua conta.</p>
                              <p className="text-green-700 mt-1">Após a confirmação, você poderá fazer login normalmente.</p>
                            </div>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Digite seu nome completo"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Digite seu email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Ao criar uma conta, você concorda com nossos termos de uso
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAuth;
