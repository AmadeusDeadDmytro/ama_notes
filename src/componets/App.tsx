import Navigation from 'containers/Navigation'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import React from 'react'
import styled from 'styled-components'

const App: React.FC = () => {
	return (
		<AppContainer>
			<Navigation />
			<NoteList />
			<NoteEditor />
		</AppContainer>
	)
}

export default App

const AppContainer = styled.div`
	display: grid;
	grid-template-areas: 'nav nav nav' 'sidebar editor editor';
	grid-template-columns: 250px auto;
	grid-template-rows: 25px auto;
	min-height: 100vh;
	border-left: 2px solid #dedede;
	border-right: 2px solid #dedede;
`
