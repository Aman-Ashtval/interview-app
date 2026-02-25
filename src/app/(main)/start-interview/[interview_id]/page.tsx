import React from 'react';      
import StartInterview from '@/view/main/start-interview/StartInterview';

export default function StartInterviewPage({ params }: { params: { interview_id: string } }) {
    const { interview_id } = params;
    return <StartInterview interview_id={interview_id} />
}