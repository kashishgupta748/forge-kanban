// ─── Complete TypeScript Types for Forge Kanban ──────────────────────────────

export interface Tag {
  id: number;
  name: string;
  color: string; // hex or tailwind color name
  board_id: number;
  created_at: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  card_id: number;
  author_id: number;
  author: Member;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  card_id?: number;
  board_id?: number;
  actor_id?: number;
  actor?: Member;
  action: string;        // e.g. "moved", "created", "commented"
  detail?: string;
  created_at: string;
}

export interface Card {
  id: number;
  list_id: number;
  board_id: number;
  title: string;
  description?: string;
  position: number;
  due_date?: string;       // ISO date string
  is_archived: boolean;
  tags: Tag[];
  members: Member[];
  comments_count: number;
  attachments_count: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanList {
  id: number;
  board_id: number;
  name: string;
  position: number;
  is_archived: boolean;
  cards: Card[];
  cards_count: number;
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: number;
  name: string;
  description?: string;
  color: string;           // e.g. "indigo", "rose", "emerald" etc.
  is_archived: boolean;
  lists: KanbanList[];
  lists_count: number;
  cards_count: number;
  members: Member[];
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_boards: number;
  total_cards: number;
  overdue_cards: number;
  due_today: number;
  recent_activities: Activity[];
  recent_boards: Board[];
}

// ─── Create / Update DTOs ─────────────────────────────────────────────────────

export interface CreateBoard {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBoard {
  name?: string;
  description?: string;
  color?: string;
  is_archived?: boolean;
}

export interface CreateList {
  name: string;
  position?: number;
}

export interface UpdateList {
  name?: string;
  position?: number;
  is_archived?: boolean;
}

export interface CreateCard {
  title: string;
  description?: string;
  due_date?: string;
  position?: number;
}

export interface UpdateCard {
  title?: string;
  description?: string;
  due_date?: string | null;
  is_archived?: boolean;
  position?: number;
  list_id?: number;
}

export interface MoveCard {
  list_id: number;
  position: number;
}

export interface CreateComment {
  text: string;
}

export interface UpdateComment {
  text: string;
}

export interface CreateTag {
  name: string;
  color: string;
}

export interface CreateMember {
  name: string;
  email: string;
  role?: 'admin' | 'member' | 'viewer';
}

export interface UpdateMember {
  name?: string;
  email?: string;
  role?: 'admin' | 'member' | 'viewer';
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export type BoardColor =
  | 'indigo'
  | 'rose'
  | 'amber'
  | 'emerald'
  | 'sky'
  | 'violet'
  | 'pink'
  | 'teal'
  | 'orange'
  | 'cyan';

export interface ColorOption {
  name: BoardColor;
  bg: string;
  border: string;
  text: string;
  light: string;
}

export const BOARD_COLORS: ColorOption[] = [
  { name: 'indigo',  bg: 'bg-indigo-600',  border: 'border-indigo-500',  text: 'text-indigo-400',  light: '#6366f1' },
  { name: 'rose',    bg: 'bg-rose-600',    border: 'border-rose-500',    text: 'text-rose-400',    light: '#f43f5e' },
  { name: 'amber',   bg: 'bg-amber-600',   border: 'border-amber-500',   text: 'text-amber-400',   light: '#f59e0b' },
  { name: 'emerald', bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-400', light: '#10b981' },
  { name: 'sky',     bg: 'bg-sky-600',     border: 'border-sky-500',     text: 'text-sky-400',     light: '#0ea5e9' },
  { name: 'violet',  bg: 'bg-violet-600',  border: 'border-violet-500',  text: 'text-violet-400',  light: '#8b5cf6' },
  { name: 'pink',    bg: 'bg-pink-600',    border: 'border-pink-500',    text: 'text-pink-400',    light: '#ec4899' },
  { name: 'teal',    bg: 'bg-teal-600',    border: 'border-teal-500',    text: 'text-teal-400',    light: '#14b8a6' },
  { name: 'orange',  bg: 'bg-orange-600',  border: 'border-orange-500',  text: 'text-orange-400',  light: '#f97316' },
  { name: 'cyan',    bg: 'bg-cyan-600',    border: 'border-cyan-500',    text: 'text-cyan-400',    light: '#06b6d4' },
];
