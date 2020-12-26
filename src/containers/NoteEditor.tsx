import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { Dispatch } from 'redux'
import { NoteItem } from 'types'
import React from 'react'
import { connect } from 'react-redux'
import options from 'constants/codeMirrorOptions'
import styled from 'styled-components'
import { updateNote } from 'actions'

interface NoteEditorProps {
    note: NoteItem
    updateNote: Function
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, updateNote }) => {
    return (
        <Editor
            className="editor"
            value={note.text}
            options={options}
            onBeforeChange={(editor, data, value) => {
                updateNote(note.text)
            }}
            onChange={(editor, data, value) => {}}
        />
    )
}

const mapStateToProps = (state) => ({
    note: state.notes.find((note) => note.id === state.active),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateNote: (note: any) => dispatch(updateNote(note)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor)

const Editor = styled(CodeMirror)`
    grid-area: editor;

    .CodeMirror {
        -webkit-font-smoothing: subpixel-antialiased;
        height: 100%;
        font-family: Menlo, Monaco, monospace;
        font-weight: 500;
        font-size: 15px;
    }
`
