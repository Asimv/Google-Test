'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview This file defines a Genkit flow for recommending webinars to users
 * based on their profile and interests.
 *
 * - recommendWebinars -  A function that takes user profile and interests as input and returns a list of recommended webinars.
 * - RecommendWebinarsInput - The input type for the recommendWebinars function.
 * - RecommendWebinarsOutput - The output type for the recommendWebinars function.
 */

const UserProfileSchema = z.object({
  userId: z.string().describe('The unique identifier of the user.'),
  interests: z.array(z.string()).describe('List of user interests (e.g., AI, marketing, finance).'),
  jobTitle: z.string().describe('The job title of the user.'),
  industry: z.string().describe('The industry the user belongs to.'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The skill level of the user.'),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

const WebinarSchema = z.object({
  webinarId: z.string().describe('The unique identifier of the webinar.'),
  title: z.string().describe('The title of the webinar.'),
  description: z.string().describe('A brief description of the webinar.'),
  topics: z.array(z.string()).describe('List of topics covered in the webinar.'),
  industry: z.string().describe('The industry the webinar is relevant to.'),
  isFree: z.boolean().describe('Indicates if the webinar is free or paid.'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).describe('The skill level targeted by the webinar.'),
  registrants: z.number().describe('The number of people registered for the webinar.'),
});

export type Webinar = z.infer<typeof WebinarSchema>;

const RecommendWebinarsInputSchema = z.object({
  userProfile: UserProfileSchema.describe('The profile of the user.'),
  availableWebinars: z.array(WebinarSchema).describe('List of available webinars to recommend from.'),
});

export type RecommendWebinarsInput = z.infer<typeof RecommendWebinarsInputSchema>;

const RecommendationSchema = z.object({
  webinarId: z.string().describe('The ID of the recommended webinar.'),
  reason: z.string().describe('The reason why this webinar is recommended for the user.'),
});

const RecommendWebinarsOutputSchema = z.array(RecommendationSchema);

export type RecommendWebinarsOutput = z.infer<typeof RecommendWebinarsOutputSchema>;


const recommendWebinarsTool = ai.defineTool({
  name: 'getRelevantWebinars',
  description: 'Given a user profile and a list of webinars, determines which webinars are most relevant to the user and provides a reason for each recommendation.',
  inputSchema: RecommendWebinarsInputSchema,
  outputSchema: RecommendWebinarsOutputSchema,
},
async (input) => {
  // This is a placeholder implementation. Replace with actual logic to
  // determine relevant webinars based on user profile and interests.
  // In a real application, this might involve querying a database or
  // calling an external recommendation service.

  const recommendations: RecommendationSchema[] = [];

  for (const webinar of input.availableWebinars) {
    let reason = '';

    // Check for matching interests
    const matchingInterests = webinar.topics.filter(topic => input.userProfile.interests.includes(topic));
    if (matchingInterests.length > 0) {
      reason += `Matches user interests: ${matchingInterests.join(', ')}. `;      
    }

    // Check for matching industry
    if (webinar.industry === input.userProfile.industry) {
      reason += 'Matches user industry. ';
    }

    //Check for matching skill level
    if (webinar.skillLevel === input.userProfile.skillLevel) {
      reason += 'Matches user skill level.';
    }

    if (reason !== '') {
      recommendations.push({
        webinarId: webinar.webinarId,
        reason: reason.trim(),
      });
    }
  }

  // Return a maximum of 3 recommendations to keep the UI clean
  return recommendations.slice(0, 3);
});


const recommendWebinarsPrompt = ai.definePrompt({
  name: 'recommendWebinarsPrompt',
  tools: [recommendWebinarsTool],
  prompt: `Based on the user profile and available webinars, recommend up to 3 most relevant webinars to the user. Use the getRelevantWebinars tool to determine the recommendations.

  User Profile:
  {{json userProfile}}

  Available Webinars:
  {{json availableWebinars}}
  `,
});


const RecommendWebinarsFlowInputSchema = z.object({
  userProfile: UserProfileSchema,
  availableWebinars: z.array(WebinarSchema),
});

const RecommendWebinarsFlowOutputSchema = z.array(RecommendationSchema);


const recommendWebinarsFlow = ai.defineFlow({
  name: 'recommendWebinarsFlow',
  inputSchema: RecommendWebinarsFlowInputSchema,
  outputSchema: RecommendWebinarsFlowOutputSchema,
}, async (input) => {
  const {text} = await recommendWebinarsPrompt(input);
  // The tool already returns the correctly typed object.
  return await recommendWebinarsTool(input);
});

export async function recommendWebinars(input: RecommendWebinarsInput): Promise<RecommendWebinarsOutput> {
  return recommendWebinarsFlow(input);
}
