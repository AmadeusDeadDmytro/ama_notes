import React, { useEffect } from 'react'
import { loadCategories, loadNotes } from 'actions'

import AppSidebar from 'containers/AppSidebar'
import { Dispatch } from 'redux'
import { KeyboardProvider } from 'contexts/KeyboardContext'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import NoteEditor from 'containers/NoteEditor'
import NoteList from 'containers/NoteList'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { ApplicationState } from 'types'
import SettingsModal from 'containers/SettingsModal'

interface AppProps {
    loadNotes: () => void
    loadCategories: () => void
    dark?: boolean
}

const App: React.FC<AppProps> = ({ loadNotes, loadCategories, dark }) => {
    let theme = ''

    if (dark) {
        theme = 'dark'
    }

    useEffect(() => {
        loadNotes()
    }, [loadNotes])

    useEffect(() => {
        loadCategories()
    }, [loadCategories])

    return (
        <AppContainer theme={theme}>
            <KeyboardProvider>
                <AppSidebar />
                <NoteList />
                <NoteEditor />
                <KeyboardShortcuts />
                <SettingsModal />
            </KeyboardProvider>
        </AppContainer>
    )
}

const mapStateToProps = (state: ApplicationState) => ({
    dark: state.themeState.dark,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadNotes: () => dispatch(loadNotes()),
    loadCategories: () => dispatch(loadCategories()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

const AppContainer = styled.div`
    display: grid;
    grid-template-areas: 'app-sidebar note-sidebar editor editor';
    grid-template-columns: 175px 300px auto;
    height: 100vh;
`
