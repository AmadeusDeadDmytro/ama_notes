import { SWAP_NOTE } from './../constants/actionTypes';
import { initialState } from './../constants/fakeState';

const activeReducer = (state = initialState[0].id, action: { type: any; payload: any; }) => {
	switch (action.type) {
		case SWAP_NOTE:
			return action.payload;
		default:
			return state
	}
}

export default activeReducer