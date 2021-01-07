import { ApplicationState, CategoryItem, NoteItem } from 'types'
import { Download, X } from 'react-feather'
import { addNote, sendNoteToTrash, swapNote, syncState } from 'actions'
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
    activeNote?: NoteItem
    activeCategoryId: string
    notes: NoteItem[]
    categories: CategoryItem[]
}

const NoteOptions: React.FC<NoteOptionsProps> = ({ activeNote, activeCategoryId, swapNote, sendNoteToTrash, notes, categories }) => {
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

    const syncNotesHandler = () => {
        syncState(notes, categories)
    }

    const downloadNoteHandler = () => {
        if (activeNote) {
            downloadNote(getNoteTitle(activeNote.text), activeNote)
        }
    }

    return (
        <NoteOptionsNav>
            <NavButton onClick={trashNoteHandler}>
                <X size={15} />
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
