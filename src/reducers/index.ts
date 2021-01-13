import { Reducer, combineReducers } from 'redux'

import { ApplicationState } from 'types'
import categoryReducer from 'reducers/categoryReducer'
import noteReducer from 'reducers/noteReducer'
import syncReducer from 'reducers/syncReducer'
import themeReducer from 'reducers/themeReducer'
import settingsReducer from 'reducers/settingsReducer'

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    noteState: noteReducer,
    categoryState: categoryReducer,
    syncState: syncReducer,
    themeState: themeReducer,
    settingsState: settingsReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
