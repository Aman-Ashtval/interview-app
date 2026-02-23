export interface GeneratedContentResponse {
    candidates: Candidate[];
}

export interface Candidate {
    content: {
        parts: {
            text: string;
        }[];
    };
}
