import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { membersApi } from '../api/members'
import type { CreateMember, UpdateMember } from '../types'
import toast from 'react-hot-toast'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const memberKeys = {
  all: ['members'] as const,
  board: (boardId: number) => ['members', 'board', boardId] as const,
  detail: (id: number) => ['members', id] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all members (global or board-scoped) */
export function useMembers(boardId?: number) {
  return useQuery({
    queryKey: boardId ? memberKeys.board(boardId) : memberKeys.all,
    queryFn: () => membersApi.getMembers(boardId),
  })
}

/** Create a member */
export function useCreateMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMember) => membersApi.createMember(payload),
    onSuccess: (member) => {
      qc.invalidateQueries({ queryKey: memberKeys.all })
      toast.success(`Member "${member.name}" added!`)
    },
  })
}

/** Update a member */
export function useUpdateMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMember }) =>
      membersApi.updateMember(id, payload),
    onSuccess: (member) => {
      qc.invalidateQueries({ queryKey: memberKeys.all })
      qc.setQueryData(memberKeys.detail(member.id), member)
      toast.success('Member updated.')
    },
  })
}

/** Delete a member */
export function useDeleteMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => membersApi.deleteMember(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: memberKeys.all })
      toast.success('Member removed.')
    },
  })
}
