import apiClient from './client'
import type { Member, CreateMember, UpdateMember } from '../types'

// ─── Members API ──────────────────────────────────────────────────────────────

export const membersApi = {
  /** List all members (global or board-scoped) */
  getMembers: async (boardId?: number): Promise<Member[]> => {
    const url = boardId ? `/boards/${boardId}/members` : '/members'
    const { data } = await apiClient.get<Member[]>(url)
    return data
  },

  /** Get a single member */
  getMember: async (id: number): Promise<Member> => {
    const { data } = await apiClient.get<Member>(`/members/${id}`)
    return data
  },

  /** Create a new member */
  createMember: async (payload: CreateMember): Promise<Member> => {
    const { data } = await apiClient.post<Member>('/members', payload)
    return data
  },

  /** Update a member */
  updateMember: async (id: number, payload: UpdateMember): Promise<Member> => {
    const { data } = await apiClient.patch<Member>(`/members/${id}`, payload)
    return data
  },

  /** Delete a member */
  deleteMember: async (id: number): Promise<void> => {
    await apiClient.delete(`/members/${id}`)
  },

  /** Add member to board */
  addToBoardId: async (boardId: number, memberId: number): Promise<void> => {
    await apiClient.post(`/boards/${boardId}/members/${memberId}`)
  },

  /** Remove member from board */
  removeFromBoard: async (boardId: number, memberId: number): Promise<void> => {
    await apiClient.delete(`/boards/${boardId}/members/${memberId}`)
  },
}
