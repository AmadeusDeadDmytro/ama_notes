import { ApplicationState, NoteItem } from 'types'
import { pruneNotes, swapNote } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import { getNoteTitle } from 'helpers'
import styled from 'styled-components'

interface NoteListProps {
    active: string
    notes: NoteItem[]
    swapNote: Function
    pruneNotes: Function
}

const NoteList: React.FC<NoteListProps> = ({ active, notes, swapNote, pruneNotes }) => {
    return (
        <NoteSidebar>
            <NoteListContainer>
                {notes.map((note) => {
                    const noteTitle: string = getNoteTitle(note.text)

                    return (
                        <NoteEach
                            key={note.id}
                            active={note.id === active}
                            onClick={() => {
                                if (note.id !== active) {
                                    swapNote(note.id)
                                    pruneNotes()
                                }
                            }}
                        >
                            {noteTitle}
                        </NoteEach>
                    )
                })}
            </NoteListContainer>
        </NoteSidebar>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    notes: state.noteState.notes,
    active: state.noteState.active,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    swapNote: (noteId: string) => dispatch(swapNote(noteId)),
    pruneNotes: () => dispatch(pruneNotes()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)

const NoteSidebar = styled.aside`
    grid-area: note-sidebar;
    background: ${Colors.BACKGROUND};
`

const NoteListContainer = styled.div``

const NoteEach = styled.div<{ active: boolean }>`
    cursor: pointer;
    padding: 0.5rem;
    border-bottom: 2px solid ${Colors.HOVER};
    background: ${({ active }) => active && Colors.ACTIVE};
    &:hover {
        background: ${Colors.HOVER};
    }
`
