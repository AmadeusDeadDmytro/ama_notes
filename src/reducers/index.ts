import active from 'reducers/activeReducer'
import { combineReducers } from 'redux';
import notes from 'reducers/noteReducer'

export default combineReducers({
	notes,
	active
} as any)