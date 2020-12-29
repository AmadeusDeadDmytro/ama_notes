import { all, put, take, takeLatest } from 'redux-saga/effects'
import { requestCategories, requestNotes, saveState } from 'api'

import { ActionType } from 'constants/enums'

function* fetchNotes() {
    try {
        const data = yield requestNotes()
        yield put({ type: ActionType.LOAD_NOTES_SUCCESS, payload: data })
    } catch (error) {
        yield put({ type: ActionType.LOAD_NOTES_ERROR, payload: error.message })
    }
}

function* fetchCategories() {
    try {
        const data = yield requestCategories()
        yield put({ type: ActionType.LOAD_CATEGORIES_SUCCESS, payload: data })
    } catch (error) {
        yield put({ type: ActionType.LOAD_CATEGORIES_ERROR, payload: error.message })
    }
}

function* syncState(state) {
    console.log('s', state)

    try {
        yield saveState(state)

        yield put({ type: ActionType.SYNC_STATE_SUCCESS })
    } catch (error) {
        yield put({ type: ActionType.SYNC_STATE_ERROR, payload: error.message })
    }
}

export function* allSaga() {
    yield all([takeLatest(ActionType.LOAD_NOTES, fetchNotes), takeLatest(ActionType.LOAD_CATEGORIES, fetchCategories), takeLatest(ActionType.SYNC_STATE, syncState)])
}

export default allSaga
