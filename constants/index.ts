export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

    export const prepareInstructions = ({
      jobTitle,
      jobDescription,
    }: {
      jobTitle: string;
      jobDescription: string;
    }) => `
    You are an ATS resume analyzer.
    
    You MUST return ONLY valid JSON.
    Do NOT include explanations, markdown, headings, or text outside the JSON object.
    
    The JSON schema is EXACTLY:
    
    {
      "atsScore": number,
      "summary": string,
      "strengths": string[],
      "weaknesses": string[],
      "improvements": string[]
    }
    
    Rules:
    - atsScore must be between 0 and 100
    - strengths, weaknesses, improvements must be arrays of strings
    - summary must be a concise paragraph
    - If something is missing, return an empty array or empty string
    - Never include text before or after the JSON
    
    Job Title: ${jobTitle}
    Job Description: ${jobDescription}
    `;
    
