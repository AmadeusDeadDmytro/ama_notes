import React, { useEffect } from 'react'
import { loadCategories, loadNotes } from 'actions'

import AppSidebar from 'containers/AppSidebar'
import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import Navigation from 'containers/Navigation'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import { connect } from 'react-redux'
import styled from 'styled-components'

interface AppProps {
    loadNotes: () => void
    loadCategories: () => void
}

const App: React.FC<AppProps> = ({ loadNotes, loadCategories }) => {
    useEffect(() => {
        loadNotes()
    }, [loadNotes])

    useEffect(() => {
        loadCategories()
    }, [loadCategories])

    return (
        <AppContainer>
            <AppSidebar />
            <NoteList />
            <NoteEditor />
            <Navigation />
        </AppContainer>
    )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadNotes: () => dispatch(loadNotes()),
    loadCategories: () => dispatch(loadCategories()),
})

export default connect(null, mapDispatchToProps)(App)

const AppContainer = styled.div`
    display: grid;
    grid-template-areas: 'app-sidebar note-sidebar editor editor' 'nav nav nav nav';
    grid-template-columns: 175px 300px auto;
    grid-template-rows: auto 25px;
    min-height: 100vh;
`
