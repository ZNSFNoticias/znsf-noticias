/*
  supabaseClient.js
  -----------------
  Inicializa y exporta el cliente de Supabase para toda la app.
  Usa variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.
  Modifica este archivo solo si cambias la configuración de Supabase o el método de autenticación.
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // URL de tu proyecto Supabase
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Clave pública de tu proyecto

export const supabase = createClient(supabaseUrl, supabaseAnonKey); // Cliente global para usar en toda la app
