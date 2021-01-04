import { Actions, Folders } from 'constants/enums'
import { NoteItem, NoteState, NotesActionTypes } from 'types'

import { loadNotes } from './../actions/index'
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
                activeNoteId: action.payload.length > 0 ? action.payload[0].id : '',
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
                activeFolder: Folders.NONE,
                activeNoteId: getFirstNote(Folders.NONE, state.notes, action.payload),
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
                activeNoteId: getNewNoteId(state.notes, action.payload),
            }
        case Actions.DELETE_NOTE:
            return {
                ...state,
                notes: state.notes.filter((note) => note.id !== action.payload),
                activeNoteId: getNewNoteId(state.notes, action.payload),
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
    switch (folder) {
        case Folders.NONE:
            return notes.find((note) => note.category === categoryId) ? notes.find((note) => note.category === categoryId)!.id : ''
        case Folders.ALL:
            return notes.length > 0 ? notes[0].id : ''
        case Folders.TRASH:
            return notes.find((note) => note.trash) ? notes.find((note) => note.trash)!.id : ''
        default:
            return ''
    }
}

export function getNewNoteId(notes: NoteItem[], payload: string): string {
    const deletedNoteIndex = notes.findIndex((note) => note.id === payload)
    let newActiveNoteId = ''

    if (deletedNoteIndex === 0 && notes[1]) {
        newActiveNoteId = notes[deletedNoteIndex + 1].id
    } else if (notes[deletedNoteIndex - 1]) {
        newActiveNoteId = notes[deletedNoteIndex - 1].id
    }

    return newActiveNoteId
}
