import { Question } from "@/types/interview";

export const getPrompt = (jobRole: string, jobDescription: string, yearsOfExperience: string, level: string) : string => {
    return `Generate 10 interview questions and answers for the job role: ${jobRole}, job description: ${jobDescription}, years of experience: ${yearsOfExperience}, level: ${level} return in JSON format with the following structure: [{question: string, answer: string}]`;
}

export const getPromptForUserAnswer = (questions: Question[]) : string => {
    return `here I have give you an array of questions and right answer and user_answer
    : ${JSON.stringify(questions)} 
    you have to evaluate the feedback, ratingand return my data in JSON formate`;
}