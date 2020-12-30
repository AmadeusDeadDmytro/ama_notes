import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/addon/selection/active-line.js'

import { Controlled as CodeMirror } from 'react-codemirror2'
import Colors from 'styles/colors'
import { Dispatch } from 'redux'
import { NoteItem } from 'types'
import React from 'react'
import { connect } from 'react-redux'
import options from 'constants/codeMirrorOptions'
import styled from 'styled-components'
import { updateNote } from 'actions'

interface UpdateNoteParams {
    id: string
    text: string
}

interface NoteEditorProps {
    loading: boolean
    activeNote: NoteItem
    updateNote: (params: UpdateNoteParams) => void
}

const NoteEditor: React.FC<NoteEditorProps> = ({ loading, activeNote, updateNote }) => {
    if (loading) {
        return <EmptyEditor />
    } else if (!activeNote) {
        return <EmptyEditorCenter>Создать первую запись</EmptyEditorCenter>
    } else {
        return (
            <Editor
                className="mousetrap"
                value={activeNote.text}
                options={options}
                editorDidMount={(editor) => {
                    editor.focus()
                }}
                onBeforeChange={(editor, data, value) => {
                    updateNote({ id: activeNote.id, text: value })
                }}
                onChange={(editor, data, value) => {}}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    loading: state.noteState.loading,
    activeNote: state.noteState.notes.find((note) => note.id === state.noteState.active),
    notes: state.noteState.notes,
    active: state.noteState.active,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateNote: (note: any) => dispatch(updateNote(note)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor)

const EmptyEditor = styled.div`
    grid-area: editor;
    max-height: calc(100vh - 25px);
    overflow-y: auto;
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
    }

    .CodeMirror-activeline-background {
        background: rgba(0, 0, 0, 0.05) !important;
    }
`
