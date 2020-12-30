import { CategoryItem, NoteItem } from 'types'

import { ActionType } from 'constants/enums'

export const addNote = (note: NoteItem) => ({
    type: ActionType.ADD_NOTE,
    payload: note,
})

export const deleteNote = (noteId: string) => ({
    type: ActionType.DELETE_NOTE,
    payload: noteId,
})

export const updateNote = (note: NoteItem) => ({
    type: ActionType.UPDATE_NOTE,
    payload: note,
})

export const swapNote = (noteId: string) => ({
    type: ActionType.SWAP_NOTE,
    payload: noteId,
})

export const loadNotes = () => ({
    type: ActionType.LOAD_NOTES,
})

export const addCategory = (category: CategoryItem) => ({
    type: ActionType.ADD_CATEGORY,
    payload: category,
})

export const loadCategories = () => ({
    type: ActionType.LOAD_CATEGORIES,
})

export const pruneNotes = () => ({
    type: ActionType.PRUNE_NOTES,
})

export const syncState = (notes: NoteItem[], categories: CategoryItem[]) => ({
    type: ActionType.SYNC_STATE,
    payload: { notes, categories },
})
