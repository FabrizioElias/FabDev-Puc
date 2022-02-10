import { Route, Switch } from 'react-router'
import Layout from './components/Layout'
import Home from './components/Home'
import DoaTime from './components/pucminas/DoaTime'

import './custom.css'

export default () => {
    return (
        <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/doatime" component={DoaTime} />
            </Switch>
        </Layout>
    )
}
