import Colors from 'styles/colors'
import Navigation from 'containers/Navigation'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import React from 'react'
import styled from 'styled-components'

const App: React.FC = () => {
    return (
        <AppContainer>
            <NoteList />
            <NoteEditor />
            <Navigation />
        </AppContainer>
    )
}

export default App

const AppContainer = styled.div`
    display: grid;
    grid-template-areas: 'sidebar editor editor' 'nav nav nav';
    grid-template-columns: 250px auto;
    grid-template-rows: auto 25px;
    min-height: 100vh;
    border-left: 2px solid ${Colors.HOVER};
    border-right: 2px solid ${Colors.HOVER};
`
