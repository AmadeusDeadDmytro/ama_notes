import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { swapNote } from 'actions'

const NoteList = ({ notes, swapNote }) => {
	return (
		<Sidebar>
			<NoteListContainer>
				{notes.map((note) => {
					const noteTitle = note.text.indexOf('\n') !== -1 ? note.text.slice(0, note.text.indexOf('\n')) : note.text.slice(0, 50)
					return (
						<NoteTitle key={note.id} onClick={() => {
							swapNote(note.id)
						}}>
							{noteTitle}
						</NoteTitle>
					)
				})}
			</NoteListContainer>
		</Sidebar>
	)
}

const mapStateToProps = (state: { notes: any }) => ({
	notes: state.notes
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
	swapNote: noteId => dispatch(swapNote(noteId))
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)

const Sidebar = styled.aside`
	grid-area: sidebar;
	background: #efefef;
`

const NoteListContainer = styled.div`

`

const NoteTitle = styled.div`
	cursor: pointer;
	padding: 1rem;
	border-bottom: 2px solid #dedede;
	&:hover {
		background: #dedede;
	}
`