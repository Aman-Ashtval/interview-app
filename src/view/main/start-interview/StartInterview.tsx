"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./start-interview.module.scss";
import { MockInterviewDetails } from "@/types/interview";
import { LightbulbIcon, Loader2, WebcamIcon } from "lucide-react";
import { toast } from "sonner";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export interface StartInterviewProps {
  interview_id: string;
}

const StartInterview = ({ interview_id }: StartInterviewProps) => {
  const [mockDetails, setMockDetails] = useState<MockInterviewDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchMockDetails = async () => {
    if (!interview_id) {
      return;
    }
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("mock_interview")
        .select("*")
        .eq("mock_id", interview_id)
        .single();
      if (fetchError) throw fetchError;
      setMockDetails(data as MockInterviewDetails);
    } catch (err) {
      toast.error("Failed to load interview");
      setMockDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockDetails();
  }, [interview_id]);

  if (loading) {
    return (
      <div className={styles["info-bg"]}>
        <Loader2 className="animate-spin text-violet-500" />
      </div>
    );
  }

  if (!mockDetails) {
    return (
      <div className={styles["info-bg"]}>
        <p>Interview not found.</p>
      </div>
    );
  }

  return (
    <div className={styles["start-interview-bg"]}>
      <h1 className={styles["title-text"]}>Let&apos;s start the Interview</h1>
      <div className={styles["start-interview-container"]}>
        <div className={styles["context-container"]}>
          <Card className={styles["context-card"]}>
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={styles["context-item"]}>
                    <p>Job Title/Job Role:</p>
                    <p>{mockDetails.job_title}</p>
                </div>
                <div className={styles["context-item"]}>
                    <p>Job Description:</p>
                    <p>{mockDetails.job_description}</p>
                </div> 
                <div className={styles["context-item"]}>
                    <p>Experience:</p>
                    <p>{mockDetails.experience} years</p>
                </div>         
                <div className={styles["context-item"]}>
                    <p>Level:</p>
                    <p>{mockDetails.level}</p>
                </div>
            </CardContent>
          </Card>
          <Card className={styles["info-card"]}>
            <CardContent className="pt-4">
                <h3 className="text-yellow-700 text-md font-semibold flex items-center gap-1">
                    <LightbulbIcon size={15} className="text-yellow-700" />
                    Information
                </h3>
                <p className="text-yellow-700 text-sm font-normal">
                    Enable webcam and microphone to start your AI generated mock interview.
                    it has 10 questions and you will be asked one by one, at the end you will
                    get the report based on your answers.<br /><br />
                    <b>NOTE : </b> we never record your video you can disable webcam anytime.
                </p>
            </CardContent>
           </Card>         
        </div>
        <div className={styles["camera-container"]}>
          {
            webCamEnabled ? 
            <>
            <Webcam 
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            width={500}
            height={400}
            style={{
              borderRadius: "10px"
            }}
            />
            </>
            :
            <div className={styles["icon-container"]} >
                <WebcamIcon size={100}/>
            </div>
          }
          {
            webCamEnabled ? (
              <Button variant="primary"
              onClick={() => router.push(`/start-interview/${interview_id}/start`)}
              >
                Start Interview
              </Button>
            ) :
            <Button variant="outline" onClick={() => setWebCamEnabled(true)}>
                Allow camera and microphone
            </Button>
          }
        </div>
      </div>
    </div>
  );
}

export default StartInterview;