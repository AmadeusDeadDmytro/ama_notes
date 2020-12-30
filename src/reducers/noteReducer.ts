import { NoteState, NotesActionTypes } from 'types'

import { Actions } from 'constants/enums'
import { loadNotes } from './../actions/index'
import { v4 as uuid } from 'uuid'

const initialState: NoteState = {
    notes: [],
    active: '',
    error: '',
    loading: true,
}

const noteReducer = (state = initialState, action: NotesActionTypes): NoteState => {
    switch (action.type) {
        case Actions.PRUNE_NOTES:
            return {
                ...state,
                notes: state.notes.filter((note) => note.text !== '' || note.id === state.active),
            }
        case Actions.LOAD_NOTES:
            return initialState
        case Actions.LOAD_NOTES_SUCCESS:
            return {
                ...state,
                notes: action.payload,
                active: action.payload.length > 0 ? action.payload[0].id : '',
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
                active: action.payload,
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
                            id: note.id,
                            text: action.payload.text,
                            created: '',
                            lastUpdated: '',
                        }
                    } else {
                        return note
                    }
                }),
            }
        case Actions.DELETE_NOTE:
            const deletedNoteIndex = state.notes.findIndex((note) => note.id === action.payload)
            let newActiveNoteId: string

            if (deletedNoteIndex === 0) {
                if (state.notes.find((note, i) => i === 1)) {
                    newActiveNoteId = state.notes[deletedNoteIndex + 1].id
                } else {
                    newActiveNoteId = ''
                }
            } else if (state.notes[deletedNoteIndex - 1]) {
                newActiveNoteId = state.notes[deletedNoteIndex - 1].id
            } else {
                newActiveNoteId = ''
            }

            return {
                ...state,
                notes: state.notes.filter((note) => note.id !== action.payload),
                active: newActiveNoteId,
            }
        default:
            return state
    }
}

export default noteReducer
