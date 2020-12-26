import active from './activeReducer'
import { combineReducers } from 'redux';
import notes from './noteReducer'

export default combineReducers({
	notes,
	active
} as any)