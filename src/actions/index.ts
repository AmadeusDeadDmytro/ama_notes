import { ADD_NOTE, SWAP_NOTE, UPDATE_NOTE } from './../constants/actionTypes';

export const addNote = (note: any) => ({
	type: ADD_NOTE,
	payload: note
})

export const updateNote = (note: any) => ({
	type: UPDATE_NOTE,
	payload: note
})

export const swapNote = (note: any) => ({
	type: SWAP_NOTE,
	payload: note.id
})