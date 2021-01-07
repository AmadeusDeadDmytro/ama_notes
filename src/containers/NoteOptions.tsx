import { ApplicationState, CategoryItem, NoteItem } from 'types'
import { Bookmark, Download, Trash } from 'react-feather'
import { addNote, sendNoteToTrash, swapNote, syncState, toggleFavoriteNote } from 'actions'
import { downloadNote, getNoteTitle } from 'helpers'

import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

interface NoteOptionsProps {
    swapNote: (noteId: string) => void
    sendNoteToTrash: (noteId: string) => void
    toggleFavoriteNote: (noteId: string) => void
    activeNote?: NoteItem
    activeCategoryId: string
    notes: NoteItem[]
    categories: CategoryItem[]
    clickedNote: NoteItem
}

const NoteOptions: React.FC<NoteOptionsProps> = ({ activeNote, toggleFavoriteNote, clickedNote, activeCategoryId, swapNote, sendNoteToTrash, notes, categories }) => {
    const trashNoteHandler = () => {
        if (activeNote && !activeNote.trash) {
            sendNoteToTrash(activeNote.id)
        }
    }

    const downloadNoteHandler = () => {
        if (activeNote) {
            downloadNote(getNoteTitle(activeNote.text), activeNote)
        }
    }

    const favoriteNoteHandler = () => {
        toggleFavoriteNote(clickedNote.id)
    }

    return (
        <NoteOptionsNav>
            {!clickedNote.trash && (
                <NavButton onClick={favoriteNoteHandler}>
                    <Bookmark size={15} />
                    {clickedNote.favorite ? 'Удалить из Избранного' : 'Добавить в Избранное'}
                </NavButton>
            )}
            <NavButton onClick={trashNoteHandler}>
                <Trash size={15} />
                Удалить заметку
            </NavButton>
            <NavButton onClick={downloadNoteHandler}>
                <Download size={15} />
                Скачать заметку
            </NavButton>
        </NoteOptionsNav>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    notes: state.noteState.notes,
    categories: state.categoryState.categories,
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
    activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    sendNoteToTrash: (noteId: string) => dispatch(sendNoteToTrash(noteId)),
    toggleFavoriteNote: (noteId: string) => dispatch(toggleFavoriteNote(noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteOptions)

const NoteOptionsNav = styled.nav`
    margin-top: 1rem;

    svg {
        margin-right: 0.5rem;
    }
`

const NavButton = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    background: transparent;
    font-weight: 600;
    border: none;
    font-size: 1rem;
    padding: 0 0.5rem;

    div {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
    }

    svg {
        height: 18px;
        width: 18px;
        margin-right: 0.3rem;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.1);
    }
`
