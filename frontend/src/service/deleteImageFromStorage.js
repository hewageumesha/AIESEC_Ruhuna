import { SupabaseClient } from "@supabase/supabase-js";

export const deleteImageFromStorage = async (path) => {
  const { error } = await SupabaseClient.storage.from('gallery').remove([path]);
  if (error) {
    console.error('Supabase delete error:', error.message);
    throw error;
  }
};