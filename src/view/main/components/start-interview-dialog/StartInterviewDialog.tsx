"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/utils";
import styles from "./start-interview-dialog.module.scss";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getGeminiClient } from "@/lib/gemini/GeminiApi";
import { getPrompt } from "@/utils/gemini-utils";
import { Loader2 } from "lucide-react";
import { GeneratedContentResponse } from "@/types/gemini-ai-types";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";

export interface StartInterviewDialogProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function StartInterviewDialog({
  isOpen,
  onOpenChange,
}: StartInterviewDialogProps) {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [level, setLevel] = useState("begainer");   
  const [loading, setLoading] = useState(false);  
  const supabase = createClient();              
  const router = useRouter();

  const handleCancel = () => {
    onOpenChange?.(false);
  };

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const response= await getGeminiClient().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: getPrompt(jobRole, jobDescription, yearsOfExperience, level),
      }) as GeneratedContentResponse;
      if (response.candidates && response.candidates.length > 0) {
        const content = response.candidates[0].content.parts[0].text;

        const extractedStr = content.replace(`\`\`\`json\n`, "").replace(`\n\`\`\``, "");
        const dataRes = JSON.parse(extractedStr);
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          toast.error("You must be signed in to start an interview", { position: "top-right" });
          return;
        }
        const createdBy = userData.user.email ?? "";
        const mockIdValue = uuidv4();
        const experienceYears = parseInt(String(yearsOfExperience), 10) || 0;
        const { data: insertedRow, error: insertError } = await supabase
          .from("mock_interview")
          .insert({
            job_title: jobRole || "",
            job_description: jobDescription || "",
            experience: experienceYears,
            level: level,
            created_by: createdBy,
            mock_id: mockIdValue,
            data_res: JSON.stringify(dataRes),
          })
          .select("mock_id")
          .single();

        const { error: questionsError } = await supabase
          .from("questions_table")
          .insert(
            dataRes.map((question: any) => ({
              question: question.question,
              answer: question.answer,
              mock_id: mockIdValue,
              created_by: createdBy,
              user_answer: null,
              rating: 0,
              feedback: null,
              created_at: new Date().toISOString(),
            }))
          );
        if (insertError) {
          throw insertError;
        }
        if (questionsError) {
          throw questionsError;
        }
        const mockId = insertedRow?.mock_id ?? mockIdValue;
        console.log("mockId", mockId);
        router.push(`/start-interview/${mockId}`);
      }
      onOpenChange?.(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start interview", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
        setJobRole("");
        setJobDescription("");
        setYearsOfExperience("");
        setLevel("begainer");
    }
  },[]);

  return (
    <Dialog 
    open={isOpen} 
    onOpenChange={onOpenChange}
    >
      <DialogContent
        className={cn(styles["dialog-content"])}
        aria-describedby={undefined}
      >
        <DialogHeader className={styles["dialog-header"]}>
          <DialogTitle className={styles["dialog-title"]}>
            Tell us more about your job interviewing
          </DialogTitle>
          <DialogDescription
            id="start-interview-description"
            className={styles["dialog-description"]}
          >
            Add details about your job position/role, job description and years
            of experience.
          </DialogDescription>
        </DialogHeader>

        <form
          className={styles["dialog-form"]}
          onSubmit={(e) => {
            e.preventDefault();
            handleStartInterview();
          }}
        >
          <div className={styles["field-group"]}>
            <Label
              htmlFor="job-role"
              className={styles["field-label"]}
            >
              Job Role / Job Position
            </Label>
            <Input
              id="job-role"
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className={styles["field-input"]}
              required
            />
          </div>

          <div className={styles["field-group"]}>
            <Label
              htmlFor="job-description"
              className={styles["field-label"]}
            >
              Job Description / Tech Stack (In Short)
            </Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. React, Node.js"
              rows={3}
              required
              className={cn(styles["field-input"], styles["field-textarea"])}
            />
          </div>

          <div className={styles["field-group"]}>
            <Label
              htmlFor="years-experience"
              className={styles["field-label"]}
            >
              Years of experience
            </Label>
            <Input
              id="years-experience"
              type="text"
              inputMode="numeric"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="e.g. 3 years"
              max={50}
              min={0}
              className={styles["field-input"]}
              required
            />
          </div>
          <div className={styles["field-group"]}>
            <Label
              htmlFor="job-description"
              className={styles["field-label"]}
            >
              Level
            </Label>
            <RadioGroup 
            id="level" 
            defaultValue="begainer"
            onValueChange={(value) => setLevel(value)}
            className="flex gap-4 mt-1"
            >
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="begainer" id="begainer">Begainer</RadioGroupItem>
                    <Label htmlFor="Begainer">Begainer</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="intermediate" id="intermediate">Intermediate</RadioGroupItem>
                    <Label htmlFor="Intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="advanced" id="advanced">Advanced</RadioGroupItem>
                    <Label htmlFor="advanced">Advanced</Label>
                </div>
            </RadioGroup>
          </div>

          <DialogFooter className={styles["dialog-footer"]}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className={styles["btn-cancel"]}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={styles["btn-start"]}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
