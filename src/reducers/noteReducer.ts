import { Actions, Folders } from 'constants/enums'
import { NoteItem, NoteState, NotesActionTypes } from 'types'

import { loadNotes } from './../actions/index'
import { sortByLastUpdated } from 'helpers'
import { v4 as uuid } from 'uuid'

const initialState: NoteState = {
    notes: [],
    activeNoteId: '',
    activeFolder: 'ALL',
    activeCategoryId: '',
    error: '',
    loading: true,
}

const noteReducer = (state = initialState, action: NotesActionTypes): NoteState => {
    switch (action.type) {
        case Actions.LOAD_NOTES:
            return initialState
        case Actions.LOAD_NOTES_SUCCESS:
            return {
                ...state,
                notes: action.payload,
                activeNoteId: getFirstNote(Folders.ALL, action.payload),
                loading: false,
            }
        case Actions.LOAD_NOTES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case Actions.SWAP_NOTE:
            return {
                ...state,
                activeNoteId: action.payload,
            }
        case Actions.SWAP_CATEGORY:
            return {
                ...state,
                activeCategoryId: action.payload,
                activeFolder: Folders.CATEGORY,
                activeNoteId: getFirstNote(Folders.CATEGORY, state.notes, action.payload),
            }
        case Actions.SWAP_FOLDER:
            return {
                ...state,
                activeFolder: action.payload,
                activeCategoryId: '',
                activeNoteId: getFirstNote(action.payload, state.notes),
            }
        case Actions.PRUNE_NOTES:
            return {
                ...state,
                notes: state.notes.filter((note) => note.text !== '' || note.id === state.activeNoteId),
            }
        case Actions.ADD_NOTE:
            return {
                ...state,
                notes: [...state.notes, action.payload],
            }
        case Actions.UPDATE_NOTE:
            return {
                ...state,
                notes: state.notes.map((note) => {
                    if (note.id === action.payload.id) {
                        return {
                            ...note,
                            text: action.payload.text,
                            lastUpdated: action.payload.lastUpdated,
                        }
                    } else {
                        return note
                    }
                }),
            }
        case Actions.TOGGLE_FAVORITE_NOTE:
            return {
                ...state,
                notes: state.notes.map((note) => {
                    if (note.id === action.payload) {
                        return {
                            ...note,
                            favorite: !note.favorite,
                        }
                    } else {
                        return note
                    }
                }),
            }
        case Actions.SEND_NOTE_TO_TRASH:
            return {
                ...state,
                notes: state.notes.map((note) => {
                    if (note.id === action.payload) {
                        return {
                            ...note,
                            trash: true,
                        }
                    } else {
                        return note
                    }
                }),
                activeNoteId: getNewNoteId(state.notes, action.payload, state.activeCategoryId),
            }
        case Actions.DELETE_NOTE:
            return {
                ...state,
                notes: state.notes.filter((note) => note.id !== action.payload),
                activeNoteId: getNewNoteId(state.notes, action.payload, state.activeCategoryId),
            }
        case Actions.PRUNE_CATEGORY_FROM_NOTES:
            return {
                ...state,
                notes: state.notes.map((note) => {
                    if (note.category === action.payload) {
                        return {
                            ...note,
                            category: undefined,
                        }
                    } else {
                        return note
                    }
                }),
            }
        case Actions.ADD_CATEGORY_TO_NOTE:
            return {
                ...state,
                notes: state.notes.map((note) => {
                    if (note.id === action.payload.noteId) {
                        return {
                            ...note,
                            category: action.payload.categoryId,
                        }
                    } else {
                        return note
                    }
                }),
            }
        default:
            return state
    }
}

export default noteReducer

export function getFirstNote(folder: string, notes: NoteItem[], categoryId?: string): string {
    const notesNotTrash = notes.filter((note) => !note.trash).sort(sortByLastUpdated)
    const firstNoteCategory = notesNotTrash.find((note) => note.category === categoryId)
    const firstNoteFavorite = notesNotTrash.find((note) => note.favorite)
    const firstNoteTrash = notes.find((note) => note.trash)

    switch (folder) {
        case Folders.CATEGORY:
            return firstNoteCategory ? firstNoteCategory.id : ''
        case Folders.FAVORITES:
            return firstNoteFavorite ? firstNoteFavorite.id : ''
        case Folders.TRASH:
            return firstNoteTrash ? firstNoteTrash.id : ''
        case Folders.ALL:
            return notesNotTrash.length > 0 ? notesNotTrash[0].id : ''
        default:
            return ''
    }
}

export function getNewNoteId(notes: NoteItem[], oldNoteId: string, activeCategoryId: string): string {
    const notesNotTrash = activeCategoryId ? notes.filter((note) => !note.trash && note.category === activeCategoryId) : notes.filter((note) => !note.trash)
    const deletedNoteIndex = notesNotTrash.findIndex((note) => note.id === oldNoteId)
    let newActiveNoteId = ''

    if (deletedNoteIndex === 0 && notesNotTrash[1]) {
        newActiveNoteId = notesNotTrash[deletedNoteIndex + 1].id
    } else if (notesNotTrash[deletedNoteIndex - 1]) {
        newActiveNoteId = notesNotTrash[deletedNoteIndex - 1].id
    }

    return newActiveNoteId
}
