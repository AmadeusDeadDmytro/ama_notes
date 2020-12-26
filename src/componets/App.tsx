import NoteEditor from '../containers/NoteEditor'
import NoteList from '../containers/NoteList'
import React from 'react'
import styled from 'styled-components'

const App: React.FC = () => {
	return (
		<AppContainer>
			<NoteList />
			<NoteEditor />
		</AppContainer>
	)
}

export default App

const AppContainer = styled.div`
	min-height: 100vh;
	max-width: 900px;
	margin: 0 auto;
	display: flex;
	border-left: 2px solid #dedede;
	border-right: 2px solid #dedede;
`
