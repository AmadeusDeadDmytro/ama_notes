import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/gfm/gfm.js'

import React, {Component} from 'react'
import { swapNote, updateNote } from '../actions'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import options from '../constants/codeMirrorOptions'
import styled from 'styled-components'

interface NoteObject {
	uuid: string,
	text: string
}

interface NoteProps {
	note: NoteObject,
	updateNote: Function,
	swapNote: Function
}

class NoteEditor extends Component<NoteProps> {
	state = {
		value: ""
	}

	render() {
		const {note, updateNote, swapNote} = this.props

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
}

const mapStateToProps = (state) => ({
	note: state.notes.find((note) => note.id === state.active)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	updateNote: (note: any) => dispatch(updateNote(note)),
	swapNote: (id: any) => dispatch(swapNote(id))
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NoteEditor)

const Editor = styled(CodeMirror)`
	width: 100%;

	.CodeMirror {
		-webkit-font-smoothing: subpixel-antialiased;
		height: 100%;
		font-family: Menlo, Monaco, monospace;
		font-weight: 500;
		font-size: 15px;
	}
`
