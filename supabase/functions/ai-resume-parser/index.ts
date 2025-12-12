import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobRole, candidateName } = await req.json();
    
    console.log(`Processing resume for: ${candidateName}, Role: ${jobRole}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert HR AI assistant specialized in resume analysis and candidate screening. 
    Analyze resumes objectively and provide structured assessments.
    Be fair, unbiased, and focus on skills, experience, and qualifications.
    Always provide actionable insights for hiring managers.`;

    const userPrompt = `Analyze this resume for the position of "${jobRole}":

${resumeText}

Provide a comprehensive analysis in the following JSON format:
{
  "fitScore": <number between 0-100 representing overall fit for the role>,
  "skills": [<array of key technical and soft skills identified>],
  "experienceYears": <estimated total years of relevant experience as a number>,
  "summary": "<2-3 sentence executive summary of the candidate's profile and fit>",
  "strengths": [<array of 3-5 key strengths for this role>],
  "concerns": [<array of any potential concerns or gaps>],
  "recommendedQuestions": [<array of 3-5 interview questions specific to this candidate>]
}

Return ONLY valid JSON, no additional text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    console.log("AI Response received, parsing...");

    // Parse the JSON response from AI
    let parsedAnalysis;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      parsedAnalysis = JSON.parse(cleanedResponse.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // Return a default structured response
      parsedAnalysis = {
        fitScore: 50,
        skills: ["Unable to parse - manual review required"],
        experienceYears: 0,
        summary: "AI analysis encountered an issue. Please review the resume manually.",
        strengths: [],
        concerns: ["AI parsing error - manual review recommended"],
        recommendedQuestions: ["Please describe your relevant experience for this role."]
      };
    }

    console.log("Resume analysis complete for:", candidateName);

    return new Response(JSON.stringify({
      success: true,
      analysis: parsedAnalysis
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-resume-parser:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
