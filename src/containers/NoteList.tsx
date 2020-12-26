import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const NoteList = ({ notes }) => {
	return (
		<Sidebar>
			<NoteListContainer>
				{notes.map((note) => {
					const noteTitle = note.text.indexOf('\n') !== -1 ? note.text.slice(0, note.text.indexOf('\n')) : note.text.slice(0, 50)
					return (
						<NoteTitle key={note.id}>
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

export default connect(mapStateToProps)(NoteList)

const Sidebar = styled.aside`
	background: #efefef;
	width: 350px;
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