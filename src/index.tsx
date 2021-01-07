import { applyMiddleware, compose, createStore } from 'redux'

import App from 'containers/App'
import { Provider } from 'react-redux'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import createSagaMiddleware from 'redux-saga'
import { render } from 'react-dom'
import rootReducer from 'reducers'
import rootSaga from 'sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, compose(applyMiddleware(sagaMiddleware), (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()))

sagaMiddleware.run(rootSaga)

render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>,
    document.getElementById('root')
)
