import { put, takeEvery } from 'redux-saga/effects'

import { ActionType } from 'constants/enums'

async function fetchAsync(endpoint) {
    const response = await fetch(endpoint)

    if (response.ok) {
        return await response.json()
    }

    throw new Error('Unexpected error!!!')
}

function* fetchNotes() {
    try {
        const data = yield fetchAsync('https://gist.githubusercontent.com/AmadeusDeadDmytro/f5372ce6a24f694129965382d4e0a94b/raw/61a9a9718344ba1a5bd3d447159e0986b4627076/fakeData.json')
        yield put({ type: ActionType.LOAD_NOTES_SUCCESS, payload: data })
    } catch (error) {
        yield put({ type: ActionType.LOAD_NOTES_ERROR, payload: error.message })
    }
}

export function* notesSaga() {
    yield takeEvery(ActionType.LOAD_NOTES, fetchNotes)
}

export default notesSaga
