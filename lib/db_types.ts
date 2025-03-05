export interface Profile {
    id: number;
    created_at: string; // ISO timestamp format
    first_name: string;
    last_name: string;
    subjects: Record<string, any>; // JSON structure (adjust type accordingly)
    smt_details: Record<string, any>; // JSON structure
    grade: Record<string, any>; // JSON structure
    tech_proficiency: Record<string, any>; // JSON structure
    learning_style: Record<string, any>; // JSON structure
    learning_challenges: Record<string, any>; // JSON structure
    user_id: string; // UUID
}
  