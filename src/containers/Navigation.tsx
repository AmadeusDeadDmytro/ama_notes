import { addNote, deleteNote, swapNote, syncState } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { NoteItem } from 'types'
import React from 'react'
import { connect } from 'react-redux'
import { getNoteTitle } from 'helpers'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

interface NavigationProps {
    addNote: Function
    activeNote: NoteItem
    deleteNote: Function
    swapNote: Function
    syncState: Function
    notes: NoteItem[]
    syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({ addNote, activeNote, deleteNote, swapNote, syncState, notes, syncing }) => {
    const downloadNote = (filename, text) => {
        var pom = document.createElement('a')
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        pom.setAttribute('download', `${filename}.md`)

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents')
            event.initEvent('click', true, true)
            pom.dispatchEvent(event)
        } else {
            pom.click()
        }
    }

    return (
        <NavigationContainer>
            <NavButton
                onClick={async () => {
                    const note = {
                        id: uuid(),
                        text: '',
                        created: '',
                        lastUpdated: '',
                    }

                    if ((activeNote && activeNote.text !== '') || !activeNote) {
                        await addNote(note)
                        swapNote(note.id)
                    }
                }}
            >
                + Новая запись
            </NavButton>
            <NavButton
                onClick={() => {
                    if (activeNote) {
                        deleteNote(activeNote.id)
                    }
                }}
            >
                x Удалить запись
            </NavButton>
            <NavButton
                onClick={() => {
                    if (activeNote) {
                        downloadNote(getNoteTitle(activeNote.text), activeNote.text)
                    }
                }}
            >
                ^ Скачать запись
            </NavButton>
            <NavButton
                onClick={() => {
                    syncState(notes)
                }}
            >
                Синхронизировать записи
                {syncing && 'Синхронизация...'}
            </NavButton>
        </NavigationContainer>
    )
}

const mapStateToProps = (state) => ({
    syncing: state.noteState.syncing,
    notes: state.noteState.notes,
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.active),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (note) => dispatch(addNote(note)),
    swapNote: (noteId) => dispatch(swapNote(noteId)),
    deleteNote: (noteId) => dispatch(deleteNote(noteId)),
    syncState: (notes) => dispatch(syncState(notes)),
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
