"use client";

import React, { useEffect, useState } from 'react';
import styles from './start.module.scss';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { ArrowLeftIcon, ArrowRightIcon, CircleHelp, Loader2, MicIcon, MicOffIcon, Volume2, WebcamIcon } from 'lucide-react';
import Loader from '@/components/loader/Loader';
import { Textarea } from '@/components/ui/textarea';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Question } from '@/types/interview';
import { getPromptForUserAnswer } from '@/utils/gemini-utils';
import { getGeminiClient } from '@/lib/gemini/GeminiApi';
import { GeneratedContentResponse } from '@/types/gemini-ai-types';

const Start = ({interview_id}: {interview_id: string}) => {
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCameraError, setHasCameraError] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });


    const speakQuestion = (question: string) => {
        if(question.length === 0) return;
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.lang = 'en-IN';
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        console.log(results);
        if(results.length > 0) {
            const item = allQuestions[activeIndex];
            if(item) {
                item.user_answer = results.map((result: any) => result.transcript).join(' ');
                const  newQuestions = allQuestions.map((question, index) => index === activeIndex ? item : question);
                setAllQuestions(newQuestions);
            }
        }
    }, [results]);


    useEffect(() => {
        const fetchQuestions = async () => {
            try{
                setIsLoading(true);
                const {data, error} = await supabase.from('questions_table').select('*').eq('mock_id', interview_id);
                if(error) {
                    throw error;
                }
                if(data && data.length > 0) {
                    console.log(data);
                    setAllQuestions(data);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch questions');
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [interview_id]);

    const onSubmit = async () => {
        stopSpeechToText();

        try{
            setIsSubmitting(true);
            if(allQuestions.length > 0) {
                const prompt = getPromptForUserAnswer(allQuestions);
                const response = await getGeminiClient().models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: prompt,
                })as GeneratedContentResponse;
                console.log(response);

                if (response.candidates && response.candidates.length > 0) {
                    const content = response.candidates[0].content.parts[0].text;
            
                    const extractedStr = content.replace(`\`\`\`json\n`, "").replace(`\n\`\`\``, "");
                    const dataRes = JSON.parse(extractedStr);
                    console.log(dataRes);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit questions');
        } finally {
            setIsSubmitting(false);
        }
    };


    const renderQuestions = () => {
        return (
            <div className={styles['question-container']}>
                <div className='flex flex-col gap-2'>
                    <h3 className='text-lg font-bold text-black'>Question {activeIndex + 1}:</h3>
                    <p className='text-sm text-gray-500 font-medium'>
                        {allQuestions[activeIndex]?.question}
                    </p>
                    <Volume2 
                    className='w-4 h-4 text-gray-500 cursor-pointer' 
                    onClick={() => speakQuestion(allQuestions[activeIndex]?.question)}
                    />
                </div>
                <div>
                    <h3 className='text-md font-bold text-black'>Your Answer:</h3> 
                    <Textarea 
                    className='rounded' 
                    placeholder='your answer here...'  
                    onChange={(e) => {}}
                    value={allQuestions[activeIndex]?.user_answer ?? ""}
                    rows={5}
                    />
                    <div className='flex items-center w-full mt-2'>
                        <Volume2 
                        className='w-4 h-4 text-gray-500 cursor-pointer' 
                        onClick={() => speakQuestion(allQuestions[activeIndex]?.answer ?? "")}
                        />
                    </div>
                </div>
                <div className={styles["instructions"]}>
                    <h3 className={styles["instructions__header"]}>
                        <CircleHelp className={styles["instructions__icon"]} size={20} aria-hidden />
                        Instructions
                    </h3>
                    <ul className={styles["instructions__list"]}>
                        <li>Click the start button to record your answer.</li>
                        <li>Speak clearly and naturally.</li>
                        <li>Avoid filler words like &quot;um&quot;, &quot;ah&quot;, &quot;like&quot;, &quot;you know&quot;, etc.</li>
                        <li>Do not use any external tools or references.</li>
                    </ul>
                </div>
            </div>
        );
    };

    const renderWebcam = () => {
        return (
            <div className={styles['webcam-container']}>
                {
                    hasCameraError ? (
                        <div 
                        className="flex justify-center items-center h-1/2 w-full border rounded-xl bg-gray-100"                        >
                            <WebcamIcon size={72}/>
                        </div>
                    ) : (
                        <Webcam 
                        onUserMedia={() => setHasCameraError(false)}
                        onUserMediaError={() => setHasCameraError(true)}
                        mirrored={true}
                        style={{
                            borderRadius: "10px",
                            width: "100%",
                            height: "50%",
                            objectFit: "cover",
                        }}
                        />
                    )
                }
                <div className="flex justify-center gap-2">
                    {
                        isRecording ? (
                            <Button 
                            variant="danger"
                            onClick={stopSpeechToText}
                            >
                                <MicOffIcon size={18} />
                                Stop Recording
                            </Button>
                        ) : (
                            <Button 
                            variant="secondary"
                            onClick={startSpeechToText}
                            >
                                <MicIcon size={18} />
                                Start Recording
                            </Button>
                        )
                    }   
                    {
                        (allQuestions[activeIndex]?.user_answer && !isRecording)  &&
                        <Button variant="primary" onClick={() => {
                            setAllQuestions(prev => prev.map((question, index) => index === activeIndex ? { ...question, user_answer: "" } : question));
                        }}>
                            re-answer
                        </Button>
                    }                 
                </div>
                <div className='flex justify-end items-center gap-2 w-full mt-auto'>
                    <Button 
                    variant="primary" 
                    onClick={() => {
                        if(activeIndex > 0) {
                            setActiveIndex(activeIndex - 1);
                            setResults([]);
                            stopSpeechToText();
                        }
                    }}
                    disabled={activeIndex === 0}
                    >
                        <ArrowLeftIcon size={18} />
                        Previous
                    </Button>
                    <Button variant='ghost'>{activeIndex + 1} / {allQuestions.length}</Button>
                    <Button 
                    variant="primary" 
                    onClick={() => {
                        if(activeIndex < allQuestions.length - 1) {
                            setActiveIndex(activeIndex + 1);
                            setResults([]);
                            stopSpeechToText();
                        }
                    }}
                    disabled={activeIndex === allQuestions.length - 1}
                    >
                        Next
                        <ArrowRightIcon size={18} />
                    </Button>
                    {
                        activeIndex === allQuestions.length - 1 ? (
                            <Button variant="primary" onClick={() => onSubmit()} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                                Submit
                            </Button>
                        ) : null
                    }
                </div>
            </div>
        );
    };


    return (
        <div className={styles['start-interview-container']}>
            {
                isLoading ? <Loader /> : renderQuestions()
            }
            {
                isLoading ? <Loader /> : renderWebcam()
            }
        </div>
    )
};

export default Start;