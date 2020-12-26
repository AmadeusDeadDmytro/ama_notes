import { ADD_NOTE, UPDATE_NOTE } from 'constants/actionTypes';

import { initialState } from 'constants/fakeState';
import { v4 as uuid } from 'uuid';

const noteReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_NOTE:
			return [...state, action.payload]
		case UPDATE_NOTE:
			return state.map(note => {
				if(note.id === action.payload.id){
					return {
						id: note.id,
						text: action.payload.text,
						created: note.created,
						lastUpdated: 'new-value'
					}
				} else {
					return note
				}
			})
		default:
			return state
	}
}

export default noteReducer