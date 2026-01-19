export interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    type: "order_update" | "return_update" | "broadcast";
    metadata?: any;
    user_id?: string;
}
