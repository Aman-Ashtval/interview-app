import React from 'react';
import Feedback from '@/view/main/start-interview/feedback/Feedback';

const page = ({params}: {params: {interview_id: string}}) => {
    return (
        <Feedback interview_id={params.interview_id} />
    );
};

export default page;