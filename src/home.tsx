import Nav from "./nav";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Add from './add';
import './style/css/home.css';
import Bill from "./bill";
import Analysis from "./analysis";
import Login from "./login";
import { useState } from "react";
export default function Home() {
    const [isLogged, setIslogged] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    return (
        <Router>
            {isLogged ?
                <div className='mainWrapper'>
                    <div className='leftContainer'>
                        <Nav setLog={() => setIslogged(false)} />
                    </div>
                    <div className='rightContainer'>
                        <Switch>
                            <Route exact path='/' >
                                <Add email={email} />
                            </Route>
                            <Route path='/mybill' >
                                <Bill email={email} />
                            </Route>
                            <Route path='/analysis' component={Analysis} >
                                <Analysis email={email} />
                                </Route>
                        </Switch>
                    </div>
                </div> :
                <Login setLog={(email: string) => {
                    setIslogged(true)
                    setEmail(email)
                }} />
            }
        </Router>
    )
}