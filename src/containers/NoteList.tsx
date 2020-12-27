import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { NoteItem } from 'types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { swapNote } from 'actions'

interface NoteListProps {
    notes: NoteItem[]
    swapNote: Function
}

const NoteList: React.FC<NoteListProps> = ({ notes, swapNote }) => {
    return (
        <Sidebar>
            <NoteListContainer>
                {notes.map((note) => {
                    const noteTitle = note.text.indexOf('\n') !== -1 ? note.text.slice(0, note.text.indexOf('\n')) : note.text.slice(0, 50)
                    return (
                        <NoteTitle
                            key={note.id}
                            onClick={() => {
                                swapNote(note.id)
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
    notes: state.noteState.data,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    swapNote: (noteId) => dispatch(swapNote(noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)

const Sidebar = styled.aside`
    grid-area: sidebar;
    background: ${Colors.BACKGROUND};
`

const NoteListContainer = styled.div``

const NoteTitle = styled.div`
    cursor: pointer;
    padding: 1rem;
    border-bottom: 2px solid ${Colors.HOVER};
    &:hover {
        background: ${Colors.HOVER};
    }
`
