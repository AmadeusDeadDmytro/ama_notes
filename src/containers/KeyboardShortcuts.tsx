import { ApplicationState, CategoryItem, NoteItem } from 'types'

import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'

interface KeyboardShortcutsProps {}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = () => {
    return null
}

const mapStateToProps = (state: ApplicationState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardShortcuts)
