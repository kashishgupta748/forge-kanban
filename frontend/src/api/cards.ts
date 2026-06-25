import apiClient from './client'
import type { Card, CreateCard, UpdateCard, MoveCard } from '../types'

// ─── Cards API ────────────────────────────────────────────────────────────────

export const cardsApi = {
  /** Get a single card with full details */
  getCard: async (cardId: number): Promise<Card> => {
    const { data } = await apiClient.get<Card>(`/cards/${cardId}`)
    return data
  },

  /** Create a card in a given list */
  createCard: async (
    boardId: number,
    listId: number,
    payload: CreateCard,
  ): Promise<Card> => {
    const { data } = await apiClient.post<Card>(
      `/boards/${boardId}/lists/${listId}/cards`,
      payload,
    )
    return data
  },

  /** Update card fields */
  updateCard: async (cardId: number, payload: UpdateCard): Promise<Card> => {
    const { data } = await apiClient.patch<Card>(`/cards/${cardId}`, payload)
    return data
  },

  /** Delete a card permanently */
  deleteCard: async (cardId: number): Promise<void> => {
    await apiClient.delete(`/cards/${cardId}`)
  },

  /** Move card to a different list / position */
  moveCard: async (cardId: number, payload: MoveCard): Promise<Card> => {
    const { data } = await apiClient.post<Card>(
      `/cards/${cardId}/move`,
      payload,
    )
    return data
  },

  /** Attach a tag to a card */
  attachTag: async (cardId: number, tagId: number): Promise<Card> => {
    const { data } = await apiClient.post<Card>(
      `/cards/${cardId}/tags/${tagId}`,
    )
    return data
  },

  /** Detach a tag from a card */
  detachTag: async (cardId: number, tagId: number): Promise<Card> => {
    const { data } = await apiClient.delete<Card>(
      `/cards/${cardId}/tags/${tagId}`,
    )
    return data
  },

  /** Attach a member to a card */
  attachMember: async (cardId: number, memberId: number): Promise<Card> => {
    const { data } = await apiClient.post<Card>(
      `/cards/${cardId}/members/${memberId}`,
    )
    return data
  },

  /** Detach a member from a card */
  detachMember: async (cardId: number, memberId: number): Promise<Card> => {
    const { data } = await apiClient.delete<Card>(
      `/cards/${cardId}/members/${memberId}`,
    )
    return data
  },

  /** Archive a card */
  archiveCard: async (cardId: number): Promise<Card> => {
    const { data } = await apiClient.patch<Card>(`/cards/${cardId}`, {
      is_archived: true,
    })
    return data
  },
}
