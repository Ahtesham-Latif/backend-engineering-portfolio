import { supabase } from '../config/supabase.js';

export class AuthService {
 // Register A new user
  static async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }


   // Authenticates user and returns session tokens

  static async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      throw new Error('Invalid login credentials');
    }

    return data;
  }
}