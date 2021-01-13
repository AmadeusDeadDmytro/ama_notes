import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/zenburn.css'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/keymap/vim'

import { ApplicationState, NoteItem } from 'types'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { Dispatch } from 'redux'
import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'
import { updateNote } from 'actions'

import Colors from 'styles/colors'

interface NoteEditorProps {
    loading: boolean
    activeNote?: NoteItem
    updateNote: (note: NoteItem) => void
    codeMirrorOptions: { [key: string]: any }
}

const NoteEditor: React.FC<NoteEditorProps> = ({ loading, activeNote, updateNote, codeMirrorOptions }) => {
    if (loading) {
        return <EmptyEditor>Загрузка...</EmptyEditor>
    } else if (!activeNote) {
        return <EmptyEditorCenter />
    } else {
        return (
            <Editor
                className="mousetrap"
                value={activeNote.text}
                options={codeMirrorOptions}
                editorDidMount={(editor) => {
                    editor.focus()
                    editor.setCursor(0)
                }}
                onBeforeChange={(editor, data, value) => {
                    updateNote({
                        id: activeNote.id,
                        text: value,
                        created: activeNote.created,
                        lastUpdated: moment().format(),
                    })
                }}
                onChange={(editor, data, value) => {
                    if (activeNote && activeNote.text === '') {
                        editor.focus()
                    }
                }}
            />
        )
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    loading: state.noteState.loading,
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
    codeMirrorOptions: state.settingsState.codeMirrorOptions,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateNote: (note: NoteItem) => dispatch(updateNote(note)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor)

const EmptyEditor = styled.div`
    grid-area: editor;
    background: ${Colors.A_COLOR_TEN(false)};
`

const EmptyEditorCenter = styled(EmptyEditor)`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Editor = styled(CodeMirror)`
    grid-area: editor;

    .CodeMirror {
        -webkit-font-smoothing: subpixel-antialiased;
        height: 100%;
        font-family: Menlo, Monaco, monospace;
        font-weight: 500;
        font-size: 15px;
        line-height: 1.5;
        padding-left: 1rem;
    }

    .CodeMirror-activeline-background {
        background: rgba(0, 0, 0, 0.05) !important;
    }
`
