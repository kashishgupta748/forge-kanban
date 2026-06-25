import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '../api/cards'
import { boardKeys } from './useBoards'
import type { CreateCard, UpdateCard, MoveCard } from '../types'
import toast from 'react-hot-toast'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const cardKeys = {
  all: ['cards'] as const,
  detail: (id: number) => ['cards', id] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch full card details */
export function useCard(cardId: number) {
  return useQuery({
    queryKey: cardKeys.detail(cardId),
    queryFn: () => cardsApi.getCard(cardId),
    enabled: !!cardId,
  })
}

/** Create a card in a list */
export function useCreateCard(boardId: number, listId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCard) =>
      cardsApi.createCard(boardId, listId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      toast.success('Card created.')
    },
  })
}

/** Update card */
export function useUpdateCard(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: number
      payload: UpdateCard
    }) => cardsApi.updateCard(cardId, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      qc.setQueryData(cardKeys.detail(updated.id), updated)
    },
  })
}

/** Delete card */
export function useDeleteCard(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (cardId: number) => cardsApi.deleteCard(cardId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      toast.success('Card deleted.')
    },
  })
}

/** Move card to a different list/position */
export function useMoveCard(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: number
      payload: MoveCard
    }) => cardsApi.moveCard(cardId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
    },
  })
}

/** Attach tag to card */
export function useAttachTag(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, tagId }: { cardId: number; tagId: number }) =>
      cardsApi.attachTag(cardId, tagId),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      qc.setQueryData(cardKeys.detail(updated.id), updated)
    },
  })
}

/** Detach tag from card */
export function useDetachTag(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, tagId }: { cardId: number; tagId: number }) =>
      cardsApi.detachTag(cardId, tagId),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      qc.setQueryData(cardKeys.detail(updated.id), updated)
    },
  })
}

/** Attach member to card */
export function useAttachMember(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      cardId,
      memberId,
    }: {
      cardId: number
      memberId: number
    }) => cardsApi.attachMember(cardId, memberId),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      qc.setQueryData(cardKeys.detail(updated.id), updated)
    },
  })
}

/** Detach member from card */
export function useDetachMember(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      cardId,
      memberId,
    }: {
      cardId: number
      memberId: number
    }) => cardsApi.detachMember(cardId, memberId),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      qc.setQueryData(cardKeys.detail(updated.id), updated)
    },
  })
}
