import { addNote, swapNote } from 'actions'

import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {v4 as uuid} from 'uuid'

interface NavigationProps {
	addNote: Function
	swapNote: Function
}

const Navigation: React.FC<NavigationProps> = (props) => {
	const {addNote, swapNote} = props

	return (
		<NavigationContainer>
			<button onClick={() => {
				const note = {
					id: uuid(),
					text: 'новая запись',
					created: '',
					lastUpdated: ''
				}

				addNote(note)
				swapNote(note.id)
			}}>
				+ Новая запись
			</button>
		</NavigationContainer>
	)
}

const mapStateToProps = state => ({
	state
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	addNote: note => dispatch(addNote(note)),
	swapNote: noteId => dispatch(swapNote(noteId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)

const NavigationContainer = styled.div`
	grid-area: nav;
	background: #ccc;
`