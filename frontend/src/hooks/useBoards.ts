import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { boardsApi } from '../api/boards'
import type { Board, CreateBoard, UpdateBoard, DashboardStats } from '../types'
import toast from 'react-hot-toast'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const boardKeys = {
  all: ['boards'] as const,
  lists: (archived?: boolean) => [...boardKeys.all, { archived }] as const,
  detail: (id: number) => [...boardKeys.all, id] as const,
  dashboard: ['dashboard'] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all boards */
export function useBoards(includeArchived = false) {
  return useQuery({
    queryKey: boardKeys.lists(includeArchived),
    queryFn: () => boardsApi.getBoards(includeArchived),
  })
}

/** Fetch a single board by id */
export function useBoard(id: number): UseQueryResult<Board> {
  return useQuery({
    queryKey: boardKeys.detail(id),
    queryFn: () => boardsApi.getBoard(id),
    enabled: !!id,
  })
}

/** Dashboard stats */
export function useDashboard(): UseQueryResult<DashboardStats> {
  return useQuery({
    queryKey: boardKeys.dashboard,
    queryFn: boardsApi.getDashboard,
    staleTime: 1000 * 60, // 1 minute
  })
}

/** Create a board */
export function useCreateBoard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateBoard) => boardsApi.createBoard(payload),
    onSuccess: (newBoard) => {
      qc.invalidateQueries({ queryKey: boardKeys.all })
      toast.success(`Board "${newBoard.name}" created!`)
    },
  })
}

/** Update a board */
export function useUpdateBoard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBoard }) =>
      boardsApi.updateBoard(id, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: boardKeys.all })
      qc.setQueryData(boardKeys.detail(updated.id), updated)
      toast.success('Board updated.')
    },
  })
}

/** Delete a board */
export function useDeleteBoard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => boardsApi.deleteBoard(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: boardKeys.all })
      toast.success('Board deleted.')
    },
  })
}

/** Create a list on a board */
export function useCreateList(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string }) =>
      boardsApi.createList(boardId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      toast.success('List created.')
    },
  })
}

/** Update a list */
export function useUpdateList(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      listId,
      payload,
    }: {
      listId: number
      payload: { name?: string; position?: number }
    }) => boardsApi.updateList(boardId, listId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
    },
  })
}

/** Delete a list */
export function useDeleteList(boardId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (listId: number) => boardsApi.deleteList(boardId, listId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      toast.success('List deleted.')
    },
  })
}
