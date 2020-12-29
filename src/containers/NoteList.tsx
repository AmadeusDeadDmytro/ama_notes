import { pruneNotes, swapNote } from 'actions'

import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { NoteItem } from 'types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

interface NoteListProps {
    active: string
    notes: NoteItem[]
    swapNote: Function
    pruneNotes: Function
}

const NoteList: React.FC<NoteListProps> = ({ active, notes, swapNote, pruneNotes }) => {
    return (
        <Sidebar>
            <NoteListContainer>
                {notes.map((note) => {
                    let noteTitle: string

                    if (!note.text) {
                        noteTitle = 'Новая запись'
                    } else if (note.text.indexOf('\n') !== -1) {
                        noteTitle = note.text.slice(0, note.text.indexOf('\n'))
                    } else {
                        noteTitle = note.text.slice(0, 50)
                    }

                    return (
                        <NoteTitle
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
                        </NoteTitle>
                    )
                })}
            </NoteListContainer>
        </Sidebar>
    )
}

const mapStateToProps = (state) => ({
    notes: state.noteState.notes,
    active: state.noteState.active,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    swapNote: (noteId) => dispatch(swapNote(noteId)),
    pruneNotes: () => dispatch(pruneNotes()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)

const Sidebar = styled.aside`
    grid-area: sidebar;
    background: ${Colors.BACKGROUND};
`

const NoteListContainer = styled.div``

const NoteTitle = styled.div<{ active: boolean }>`
    cursor: pointer;
    padding: 1rem;
    border-bottom: 2px solid ${Colors.HOVER};
    background: ${({ active }) => active && Colors.ACTIVE};
    &:hover {
        background: ${Colors.HOVER};
    }
`
