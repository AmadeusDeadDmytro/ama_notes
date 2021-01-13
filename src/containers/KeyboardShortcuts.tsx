import { ApplicationState, CategoryItem, NoteItem } from 'types'
import { addNote, toggleTrashedNote, swapNote, syncState, toggleDarkTheme } from 'actions'
import { downloadNote, getNoteTitle, newNote } from 'helpers'

import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import { useKey } from 'helpers/hooks'
import { useKeyboard } from 'contexts/KeyboardContext'

interface KeyboardShortcutsProps {
    addNote: (note: NoteItem) => void
    swapNote: (noteId: string) => void
    toggleTrashedNote: (noteId: string) => void
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
    activeNote?: NoteItem
    activeCategoryId: string
    activeFolder: string
    notes: NoteItem[]
    categories: CategoryItem[]
    syncing: boolean
    toggleDarkTheme: () => void
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ activeNote, activeCategoryId, activeFolder, toggleDarkTheme, addNote, swapNote, toggleTrashedNote, syncState, notes, categories }) => {
    const { addingTempCategory, setAddingTempCategory } = useKeyboard()
    const newNoteHandler = () => {
        const note = newNote(activeCategoryId, activeFolder)

        if ((activeNote && activeNote.text !== '' && !activeNote.trash) || !activeNote) {
            addNote(note)
            swapNote(note.id)
        }
    }

    const newTempCategoryHandler = () => {
        !addingTempCategory && setAddingTempCategory(true)
    }

    const trashNoteHandler = () => {
        if (activeNote && !activeNote.trash) {
            toggleTrashedNote(activeNote.id)
        }
    }

    const syncNotesHandler = () => {
        syncState(notes, categories)
    }

    const downloadNoteHandler = () => {
        if (activeNote) {
            downloadNote(getNoteTitle(activeNote.text), activeNote)
        }
    }

    const toggleDarkThemeHandler = () => {
        toggleDarkTheme()
    }

    useKey('alt+n', () => {
        newNoteHandler()
    })

    useKey('alt+c', () => {
        newTempCategoryHandler()
    })

    useKey('alt+w', () => {
        trashNoteHandler()
    })

    useKey('alt+s', () => {
        syncNotesHandler()
    })

    useKey('alt+d', () => {
        downloadNoteHandler()
    })

    useKey('alt+t', () => {
        toggleDarkThemeHandler()
    })

    return null
}

const mapStateToProps = (state: ApplicationState) => ({
    syncing: state.syncState.syncing,
    notes: state.noteState.notes,
    activeFolder: state.noteState.activeFolder,
    categories: state.categoryState.categories,
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
    activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (note: NoteItem) => dispatch(addNote(note)),
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    toggleTrashedNote: (noteId: string) => dispatch(toggleTrashedNote(noteId)),
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => dispatch(syncState(notes, categories)),
    toggleDarkTheme: () => dispatch(toggleDarkTheme()),
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardShortcuts)
