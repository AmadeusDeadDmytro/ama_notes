import { addNote, deleteNote, swapNote } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { NoteItem } from 'types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

interface NavigationProps {
    addNote: Function
    activeNote: NoteItem
    deleteNote: Function
    swapNote: Function
}

const Navigation: React.FC<NavigationProps> = ({ addNote, activeNote, deleteNote, swapNote }) => {
    return (
        <NavigationContainer>
            <NavButton
                onClick={() => {
                    const note = {
                        id: uuid(),
                        text: '',
                        created: '',
                        lastUpdated: '',
                    }

                    if (activeNote.text !== '') {
                        addNote(note)
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
                X Удалить запись
            </NavButton>
        </NavigationContainer>
    )
}

const mapStateToProps = (state) => ({
    state,
    activeNote: state.noteState.data.find((note) => note.id === state.noteState.active),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (note) => dispatch(addNote(note)),
    swapNote: (noteId) => dispatch(swapNote(noteId)),
    deleteNote: (noteId) => dispatch(deleteNote(noteId)),
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
        background: rgba(0, 0, 0, 0.1);
    }
`

const NavigationContainer = styled.div`
    grid-area: nav;
    background: ${Colors.BACKGROUND};
    display: flex;
`
