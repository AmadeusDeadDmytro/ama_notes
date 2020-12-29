import { ActionType } from 'constants/enums'
import { NoteState } from 'types'
import { loadNotes } from './../actions/index'
import { v4 as uuid } from 'uuid'

const initialState: NoteState = {
    notes: [],
    active: '',
    error: '',
    loading: true,
    syncing: false,
}

const noteReducer = (state = initialState, action): NoteState => {
    switch (action.type) {
        case ActionType.PRUNE_NOTES:
            return {
                ...state,
                notes: state.notes.filter((note) => note.text !== ''),
            }
        case ActionType.LOAD_NOTES:
            return initialState
        case ActionType.LOAD_NOTES_SUCCESS:
            return {
                ...state,
                notes: action.payload,
                active: action.payload.length > 0 ? action.payload[0].id : '',
                loading: false,
            }
        case ActionType.LOAD_NOTES_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case ActionType.SWAP_NOTE:
            return {
                ...state,
                active: action.payload,
            }
        case ActionType.ADD_NOTE:
            return {
                ...state,
                notes: [...state.notes, action.payload],
            }
        case ActionType.UPDATE_NOTE:
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
        case ActionType.DELETE_NOTE:
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
        case ActionType.SYNC_STATE:
            return {
                ...state,
                syncing: true,
            }
        case ActionType.SYNC_STATE_SUCCESS:
            return {
                ...state,
                syncing: false,
            }
        case ActionType.SYNC_STATE_ERROR:
            return {
                ...state,
                syncing: false,
                error: action.payload,
            }
        default:
            return state
    }
}

export default noteReducer
