import apiClient from './client'
import type { Board, CreateBoard, UpdateBoard, DashboardStats } from '../types'

// ─── Boards API ───────────────────────────────────────────────────────────────

export const boardsApi = {
  /** Fetch all boards (optionally include archived) */
  getBoards: async (includeArchived = false): Promise<Board[]> => {
    const { data } = await apiClient.get<Board[]>('/boards', {
      params: { include_archived: includeArchived },
    })
    return data
  },

  /** Fetch a single board with all its lists and cards */
  getBoard: async (id: number): Promise<Board> => {
    const { data } = await apiClient.get<Board>(`/boards/${id}`)
    return data
  },

  /** Create a new board */
  createBoard: async (payload: CreateBoard): Promise<Board> => {
    const { data } = await apiClient.post<Board>('/boards', payload)
    return data
  },

  /** Update board details */
  updateBoard: async (id: number, payload: UpdateBoard): Promise<Board> => {
    const { data } = await apiClient.patch<Board>(`/boards/${id}`, payload)
    return data
  },

  /** Delete (or archive) a board */
  deleteBoard: async (id: number): Promise<void> => {
    await apiClient.delete(`/boards/${id}`)
  },

  /** Archive a board */
  archiveBoard: async (id: number): Promise<Board> => {
    const { data } = await apiClient.patch<Board>(`/boards/${id}`, {
      is_archived: true,
    })
    return data
  },

  /** Add a list to a board */
  createList: async (
    boardId: number,
    payload: { name: string; position?: number },
  ): Promise<Board> => {
    const { data } = await apiClient.post<Board>(
      `/boards/${boardId}/lists`,
      payload,
    )
    return data
  },

  /** Rename a list */
  updateList: async (
    boardId: number,
    listId: number,
    payload: { name?: string; position?: number },
  ): Promise<Board> => {
    const { data } = await apiClient.patch<Board>(
      `/boards/${boardId}/lists/${listId}`,
      payload,
    )
    return data
  },

  /** Delete a list */
  deleteList: async (boardId: number, listId: number): Promise<void> => {
    await apiClient.delete(`/boards/${boardId}/lists/${listId}`)
  },

  /** Fetch dashboard stats */
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get<DashboardStats>('/dashboard')
    return data
  },
}
