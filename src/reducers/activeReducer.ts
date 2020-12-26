import { ActionType } from 'constants/actionType';
import { initialState } from 'constants/fakeState';

const activeReducer = (state = initialState[0].id, action: { type: any; payload: any; }) => {
	switch (action.type) {
		case ActionType.SWAP_NOTE:
			return action.payload;
		default:
			return state
	}
}

export default activeReducer