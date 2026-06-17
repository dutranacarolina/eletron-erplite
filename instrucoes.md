# Configuração do Supabase no Projeto ERP-Lite

Este guia fornece instruções passo-a-passo para configurar o Supabase em seu projeto ERP-Lite.

## Pré-requisitos

- Conta no GitHub (para conectar com o projeto Supabase).
- Node.js instalado no sistema.
- Acesso à internet para criar conta e projeto no Supabase.

## Passos

1. **Entrar em Supabase.com (criar conta se necessário)**
   - Acesse [Supabase.com](https://supabase.com) e faça login com sua conta existente ou crie uma nova conta se necessário.

2. **Criar novo projeto em Supabase (conectar com Github e habilitar RLS)**
   - Após o login, clique em "New Project".
   - Conecte sua conta do GitHub ao projeto.
   - Habilite Row Level Security (RLS) nas configurações do projeto.

3. **Guardar URL do projeto e Anon Key para uso posterior**
   - Na dashboard do projeto, copie a URL do projeto (Project URL).
   - Copie também a Anon Key (chave pública).
   - Guarde essas informações em um local seguro para uso nos próximos passos.

4. **Instalar Supabase na aplicação: @supabase/supabase-js**
   - Abra o terminal no diretório raiz do projeto ERP-Lite.
   - Execute o comando: `npm install @supabase/supabase-js` ou `yarn add @supabase/supabase-js`.

5. **Na raiz do projeto, criar arquivo '.env' com este conteúdo**
   - Crie um novo arquivo chamado `.env` na raiz do projeto.
   - Adicione o seguinte conteúdo ao arquivo:

     ```
     SUPABASE_URL=<colar aqui a url do projeto criado no supabase>
     SUPABASE_ANON_KEY=<colar aqui a chave ANON KEY do projeto no supabase>
     ```

     - Substitua os placeholders pelos valores copiados no passo 3.

6. **Na pasta main, criar a pasta services e dentro desta criar o arquivo supabase.ts**
   - Navegue até a pasta `main` do projeto.
   - Crie uma nova pasta chamada `services` dentro de `main`.
   - Dentro de `services`, crie um novo arquivo chamado `supabase.ts`.

7. **No arquivo supabase.ts, colocar o seguinte código**
   - Abra o arquivo `supabase.ts` e adicione o seguinte código:

     ```
     import { createClient } from '@supabase/supabase-js';
     import 'dotenv/config';

     const supabaseUrl = process.env.SUPABASE_URL!;
     const supabaseKey = process.env.SUPABASE_ANON_KEY!;

     export const supabase = createClient(supabaseUrl, supabaseKey, {
         auth: {
             persistSession: true,
             autoRefreshToken: true,
             detectSessionInUrl: false,
             storageKey: 'erp-lite-auth-token',
         },
     });
     ```

8. **Criar o arquivo src/main/services/auth.ts**
   - Na pasta `services` do projeto.
   - Crie um novo arquivo chamado `auth.ts`.
   - Adicione o código necessário para os serviços de autenticação (consulte a documentação do Supabase para implementação específica).

   ```
   import { supabase } from './supabase';

   export class AuthService {
      async login(email: string, password: string) {
         const { error: authError, data: authData } =
            await supabase.auth.signInWithPassword({
            email,
            password,
            });

         if (authError) throw new Error(`Erro ao fazer login: ${authError.message}`);

         return {
            user: authData.user,
            session: authData.session,
         };
      }

      async logout() {
         try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
         } catch (error) {
            console.error('Erro ao sair do Supabase:', error);
         }
      }
   }
   ```

## Verificação

- Verifique se o arquivo `.env` foi criado corretamente e se as variáveis de ambiente estão definidas.
- Teste a importação do cliente Supabase em outro arquivo do projeto para confirmar que não há erros.

## Solução de Problemas

- **Erro ao instalar @supabase/supabase-js:** Certifique-se de que o Node.js está instalado e atualizado. Verifique se você está no diretório correto do projeto.
- **Variáveis de ambiente não carregam:** Confirme que o arquivo `.env` está na raiz e que você está usando uma biblioteca como `dotenv` para carregá-lo.
- **Problemas com RLS:** Verifique as configurações do projeto no Supabase e habilite RLS conforme necessário.

## Notas Adicionais

- Mantenha as chaves do Supabase seguras e não as compartilhe publicamente.
- Para mais informações, consulte a [documentação oficial do Supabase](https://supabase.com/docs).
