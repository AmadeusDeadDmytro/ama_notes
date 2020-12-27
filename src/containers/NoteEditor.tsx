import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'

import React, { useEffect } from 'react'
import { loadNotes, updateNote } from 'actions'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { Dispatch } from 'redux'
import { NoteItem } from 'types'
import { connect } from 'react-redux'
import options from 'constants/codeMirrorOptions'
import styled from 'styled-components'

interface NoteEditorProps {
    loading: boolean
    note: NoteItem
    updateNote: Function
    loadNotes: Function
}

const NoteEditor: React.FC<NoteEditorProps> = ({ loading, note, updateNote, loadNotes }) => {
    useEffect(() => {
        loadNotes()
    }, [loadNotes])

    if (loading) {
        return <div>Loading...</div>
    } else {
        return (
            <Editor
                className="editor"
                value={note.text}
                options={options}
                onBeforeChange={(editor, data, value) => {
                    updateNote({ id: note.id, text: value })
                }}
                onChange={(editor, data, value) => {}}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    loading: state.noteState.loading,
    note: state.noteState.data.find((note) => note.id === state.noteState.active),
    active: state.noteState.active,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loadNotes: () => dispatch(loadNotes()),
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
