-- Atualizar seu usuário para admin
UPDATE profiles 
SET role = 'admin', user_type = 'admin'
WHERE id = 'c7132f45-9a24-4bfa-b013-241cae3b3341';

-- Verificar se atualizou
SELECT id, email, name, role, user_type, is_active 
FROM profiles 
WHERE id = 'c7132f45-9a24-4bfa-b013-241cae3b3341';
