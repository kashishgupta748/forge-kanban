import apiClient from './client'
import type { Comment, CreateComment, UpdateComment } from '../types'

// ─── Comments API ─────────────────────────────────────────────────────────────

export const commentsApi = {
  /** Get all comments for a card */
  getComments: async (cardId: number): Promise<Comment[]> => {
    const { data } = await apiClient.get<Comment[]>(
      `/cards/${cardId}/comments`,
    )
    return data
  },

  /** Post a new comment */
  createComment: async (
    cardId: number,
    payload: CreateComment,
  ): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>(
      `/cards/${cardId}/comments`,
      payload,
    )
    return data
  },

  /** Edit an existing comment */
  updateComment: async (
    cardId: number,
    commentId: number,
    payload: UpdateComment,
  ): Promise<Comment> => {
    const { data } = await apiClient.patch<Comment>(
      `/cards/${cardId}/comments/${commentId}`,
      payload,
    )
    return data
  },

  /** Delete a comment */
  deleteComment: async (cardId: number, commentId: number): Promise<void> => {
    await apiClient.delete(`/cards/${cardId}/comments/${commentId}`)
  },
}
