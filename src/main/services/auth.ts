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
