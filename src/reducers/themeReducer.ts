import { Actions } from 'constants/enums'
import { ThemeActionTypes, ThemeState } from 'types'

const initialState: ThemeState = {
    dark: false,
}

const themeReducer = (state = initialState, action: ThemeActionTypes): ThemeState => {
    switch (action.type) {
        case Actions.TOGGLE_DARK_THEME:
            return {
                ...state,
                dark: !state.dark,
            }
        default:
            return state
    }
}

export default themeReducer
