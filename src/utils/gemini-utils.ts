export const getPrompt = (jobRole: string, jobDescription: string, yearsOfExperience: string, level: string) : string => {
    return `Generate 10 interview questions and answers for the job role: ${jobRole}, job description: ${jobDescription}, years of experience: ${yearsOfExperience}, level: ${level} return in JSON format with the following structure: [{question: string, answer: string}]`;
}