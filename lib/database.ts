import { supabase } from './supabase';
import type { CreateDreamInput, Dream, DreamAnalysis, UpdateDreamInput } from './types';

/**
 * Fetch all dreams for the current user, ordered by creation date (newest first)
 */
export async function fetchDreams(): Promise<Dream[]> {
  try {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dreams:', error);
      throw new Error(`Failed to fetch dreams: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching dreams:', error);
    throw error;
  }
}

/**
 * Fetch a single dream by ID
 */
export async function fetchDreamById(id: string): Promise<Dream | null> {
  try {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching dream:', error);
      throw new Error(`Failed to fetch dream: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching dream:', error);
    throw error;
  }
}

/**
 * Create a new dream entry
 */
export async function createDream(input: CreateDreamInput): Promise<Dream> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const dreamData = {
      user_id: user.id,
      content: input.content.trim(),
      dream_date: input.dream_date || new Date().toISOString().split('T')[0],
      is_lucid: input.is_lucid || false,
    };

    const { data, error } = await supabase
      .from('dreams')
      .insert(dreamData)
      .select()
      .single();

    if (error) {
      console.error('Error creating dream:', error);
      throw new Error(`Failed to create dream: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating dream:', error);
    throw error;
  }
}

/**
 * Update an existing dream
 */
export async function updateDream(
  id: string,
  updates: UpdateDreamInput
): Promise<Dream> {
  try {
    const { data, error } = await supabase
      .from('dreams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating dream:', error);
      throw new Error(`Failed to update dream: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating dream:', error);
    throw error;
  }
}

/**
 * Delete a dream
 */
export async function deleteDream(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('dreams').delete().eq('id', id);

    if (error) {
      console.error('Error deleting dream:', error);
      throw new Error(`Failed to delete dream: ${error.message}`);
    }
  } catch (error) {
    console.error('Unexpected error deleting dream:', error);
    throw error;
  }
}

/**
 * Call the Edge Function to analyze a dream with AI
 */
export async function analyzeDream(dreamContent: string): Promise<DreamAnalysis> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/analyze-dream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ dreamContent }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze dream');
    }

    const analysis: DreamAnalysis = await response.json();
    return analysis;
  } catch (error) {
    console.error('Error analyzing dream:', error);
    throw error;
  }
}

/**
 * Create a dream and immediately analyze it with AI
 */
export async function createAndAnalyzeDream(
  input: CreateDreamInput
): Promise<Dream> {
  try {
    // First, create the dream
    const dream = await createDream(input);

    // Then, analyze it with AI
    try {
      const analysis = await analyzeDream(dream.content);

      // Update the dream with the analysis
      const updatedDream = await updateDream(dream.id, {
        title: analysis.title,
        interpretation: analysis.interpretation,
        mood: analysis.mood,
        keywords: analysis.keywords,
      });

      return updatedDream;
    } catch (analysisError) {
      console.error('AI analysis failed, but dream was saved:', analysisError);
      // Return the dream without analysis
      return dream;
    }
  } catch (error) {
    console.error('Error creating and analyzing dream:', error);
    throw error;
  }
}

