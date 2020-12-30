import { CategoryItem, NoteItem } from 'types'
import { addNote, deleteNote, swapNote, syncState } from 'actions'
import { downloadNote, getNoteTitle } from 'helpers'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

interface NavigationProps {
    addNote: (note: NoteItem) => void
    swapNote: (noteId: string) => void
    deleteNote: (noteId: string) => void
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
    activeNote: NoteItem
    notes: NoteItem[]
    categories: CategoryItem[]
    syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({ addNote, activeNote, deleteNote, swapNote, syncState, notes, syncing, categories }) => {
    const newNoteHandler = () => {
        const note: NoteItem = {
            id: uuid(),
            text: '',
            created: '',
            lastUpdated: '',
        }

        if ((activeNote && activeNote.text !== '') || !activeNote) {
            addNote(note)
            swapNote(note.id)
        }
    }

    const deleteHandler = () => {
        if (activeNote) {
            deleteNote(activeNote.id)
        }
    }

    const syncNoteHandler = () => {
        syncState(notes, categories)
    }

    const downloadHandler = () => {
        if (activeNote) {
            downloadNote(getNoteTitle(activeNote.text), activeNote.text)
        }
    }

    return (
        <NavigationContainer>
            <NavButton onClick={newNoteHandler}>+ Новая запись</NavButton>
            <NavButton onClick={deleteHandler}>x Удалить запись</NavButton>
            <NavButton onClick={downloadHandler}>^ Скачать запись</NavButton>
            <NavButton onClick={syncNoteHandler}>
                Синхронизировать записи
                {syncing && 'Синхронизация...'}
            </NavButton>
        </NavigationContainer>
    )
}

const mapStateToProps = (state) => ({
    syncing: state.syncState.syncing,
    notes: state.noteState.notes,
    categories: state.categoryState.categories,
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.active),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (note) => dispatch(addNote(note)),
    swapNote: (noteId) => dispatch(swapNote(noteId)),
    deleteNote: (noteId) => dispatch(deleteNote(noteId)),
    syncState: (notes, categories) => dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)

const NavButton = styled.button`
    display: block;
    cursor: pointer;
    background: transparent;
    font-weight: 600;
    border: none;
    font-size: 1rem;

    &:hover {
        background: ${Colors.HOVER};
    }
`

const NavigationContainer = styled.div`
    grid-area: nav;
    background: ${Colors.BACKGROUND};
    display: flex;
`
