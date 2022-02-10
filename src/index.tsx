import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import configureStore from './store/configureStore'
import App from './App'
import unregister from './registerServiceWorker'
import { ApplicationState } from './store'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterLuxon from '@mui/lab/AdapterLuxon'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string
const history = createBrowserHistory({ basename: baseUrl })

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState
const store = configureStore(history, initialState)

//registerServiceWorker();

const rootElement = document.getElementById('root')

unregister()

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <LocalizationProvider dateAdapter={AdapterLuxon} locale={'pt-BR'}>
                <ThemeProvider
                    theme={createTheme({
                        palette: {
                            mode: 'dark',
                        },
                    })}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </LocalizationProvider>
        </ConnectedRouter>
    </Provider>,
    rootElement
)
