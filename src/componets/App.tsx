import AppSidebar from 'containers/AppSidebar'
import Colors from 'styles/colors'
import Navigation from 'containers/Navigation'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import React from 'react'
import styled from 'styled-components'

const App: React.FC = () => {
    return (
        <AppContainer>
            <AppSidebar />
            <NoteList />
            <NoteEditor />
            <Navigation />
        </AppContainer>
    )
}

export default App

const AppContainer = styled.div`
    display: grid;
    grid-template-areas: 'app-sidebar note-sidebar editor editor' 'nav nav nav nav';
    grid-template-columns: 150px 250px auto;
    grid-template-rows: auto 25px;
    min-height: 100vh;
`
