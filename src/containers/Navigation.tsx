import { ApplicationState, CategoryItem, NoteItem } from 'types'
import { Cloud, Download, Plus, X } from 'react-feather'
import { addNote, deleteNote, sendNoteToTrash, swapNote, syncState } from 'actions'
import { downloadNote, getNoteTitle } from 'helpers'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

interface NavigationProps {
    addNote: (note: NoteItem) => void
    swapNote: (noteId: string) => void
    sendNoteToTrash: (noteId: string) => void
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
    activeNote?: NoteItem
    activeCategoryId: string
    notes: NoteItem[]
    categories: CategoryItem[]
    syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({ addNote, activeNote, activeCategoryId, sendNoteToTrash, swapNote, syncState, notes, syncing, categories }) => {
    const newNoteHandler = () => {
        const note: NoteItem = {
            id: uuid(),
            text: '',
            created: moment().format(),
            lastUpdated: moment().format(),
            category: activeCategoryId ? activeCategoryId : undefined,
        }

        if ((activeNote && activeNote.text !== '') || !activeNote) {
            addNote(note)
            swapNote(note.id)
        }
    }

    const trashNoteHandler = () => {
        if (activeNote && !activeNote.trash) {
            sendNoteToTrash(activeNote.id)
        }
    }

    const syncNoteHandler = () => {
        syncState(notes, categories)
    }

    const downloadHandler = () => {
        if (activeNote) {
            downloadNote(getNoteTitle(activeNote.text), activeNote)
        }
    }

    return (
        <NavigationContainer>
            <NavButton onClick={newNoteHandler}>
                <Plus /> Новая запись
            </NavButton>
            <NavButton onClick={trashNoteHandler}>
                <X /> Удалить запись
            </NavButton>
            <NavButton onClick={downloadHandler}>
                <Download /> Скачать запись
            </NavButton>
            <NavButton onClick={syncNoteHandler}>
                <Cloud />
                Синхронизировать записи
            </NavButton>
        </NavigationContainer>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    syncing: state.syncState.syncing,
    notes: state.noteState.notes,
    categories: state.categoryState.categories,
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
    activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (note: NoteItem) => dispatch(addNote(note)),
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    sendNoteToTrash: (noteId: string) => dispatch(sendNoteToTrash(noteId)),
    syncState: (notes: NoteItem[], categories: CategoryItem[]) => dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)

const NavButton = styled.button`
    display: flex;
    align-items: center;
    cursor: pointer;
    background: transparent;
    font-weight: 600;
    border: none;
    font-size: 1rem;

    &:hover {
        background: ${Colors.HOVER};
    }

    svg {
        height: 18px;
        width: 18px;
        margin-right: 0.3rem;
    }
`

const NavigationContainer = styled.div`
    grid-area: nav;
    background: ${Colors.BACKGROUND};
    display: flex;
`
