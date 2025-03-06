export interface Subject {
    subject: string;
    code: string;
    type: "theory" | "practical";
}

export interface SmtDetail {
    code: string;
    topics: string[];
}

export interface Profile {
    id: number;
    created_at: string; // ISO timestamp format
    first_name: string;
    last_name: string;
    subjects: Subject[];
    smt_details: SmtDetail[];
    grade: string;
    tech_proficiency: string;
    learning_style: string;
    learning_challenges: string[];
    user_id: string; // UUID
}