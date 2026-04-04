export type Order = {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  delivery_location?: string | null;
  delivery_preference?: string | null;
};
