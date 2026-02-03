import { User } from "./user.model";

export interface Feedback {
    feedbackId?: number,
    user: User;
    message: string;
    rating: number;
}
