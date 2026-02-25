import React from 'react';
import Start from '@/view/main/start-interview/start/Start';

const page = ({params}: {params: {interview_id: string}}) => {
    const {interview_id} = params;
    return <Start interview_id={interview_id} />;
};

export default page;