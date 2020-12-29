import { all, put, takeLatest } from 'redux-saga/effects'
import { requestNotes, saveState } from 'api'

import { ActionType } from 'constants/enums'

function* fetchNotes() {
    try {
        const data = yield requestNotes()
        yield put({ type: ActionType.LOAD_NOTES_SUCCESS, payload: data })
    } catch (error) {
        yield put({ type: ActionType.LOAD_NOTES_ERROR, payload: error.message })
    }
}

function* syncState(state) {
    try {
        yield saveState(state)

        yield put({ type: ActionType.SYNC_STATE_SUCCESS })
    } catch (error) {
        yield put({ type: ActionType.SYNC_STATE_ERROR, payload: error.message })
    }
}

export function* noteSaga() {
    yield all([takeLatest(ActionType.LOAD_NOTES, fetchNotes), takeLatest(ActionType.SYNC_STATE, syncState)])
}

export default noteSaga
