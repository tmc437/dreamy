import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for web/mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// System prompt for the AI dream analyst (from PRD)
const SYSTEM_PROMPT = `You are an empathetic and insightful dream analyst utilizing Jungian psychology and modern symbolism.

Input: User's dream description.

Output: A JSON object with the following structure:
{
  "title": "A short, creative title for the dream",
  "interpretation": "A 3-4 sentence psychological analysis of what the dream might mean regarding the user's waking life.",
  "mood": "One word describing the emotional tone (e.g., Anxious, Peaceful, Confusing)",
  "keywords": ["tag1", "tag2", "tag3"]
}

Do not include markdown formatting like \`\`\`json. Return only the raw JSON.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables not configured");
    }

    // Parse request body
    const { dreamContent } = await req.json();

    if (!dreamContent || typeof dreamContent !== "string") {
      return new Response(
        JSON.stringify({ error: "dreamContent is required and must be a string" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Optional: Rate limiting check
    // TODO: Implement rate limiting by checking user's recent requests in database

    // Call OpenAI API
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: dreamContent,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const aiData = await openaiResponse.json();
    const analysisContent = aiData.choices[0].message.content;

    // Parse the JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", analysisContent);
      throw new Error("Invalid JSON response from AI");
    }

    // Validate response structure
    if (
      !analysis.title ||
      !analysis.interpretation ||
      !analysis.mood ||
      !Array.isArray(analysis.keywords)
    ) {
      console.error("Invalid analysis structure:", analysis);
      throw new Error("AI response missing required fields");
    }

    // Log successful analysis (optional)
    console.log(`Dream analyzed for user ${user.id}`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

