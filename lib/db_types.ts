export interface Profile {
    id: number;
    created_at: string; // ISO timestamp format
    first_name: string;
    last_name: string;
    subjects: any; // JSON structure (adjust type accordingly)
    smt_details: any; // JSON structure
    grade: string;
    tech_proficiency: string;
    learning_style: string;
    learning_challenges: string[];
    user_id: string; // UUID
}
  