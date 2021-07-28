import Nav from "../components/nav";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Add from './add';
import '../style/css/home.css';
import Bill from "./bill";
import Analysis from "./analysis";
import Login from "../components/login";
import { useEffect, useState, createContext } from "react";
import '../style/css/basic.css';
export const MobileContext = createContext({});
export default function Home() {
    const [isLogged, setIslogged] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        let width = window.innerWidth;
        if (width < 900) setIsMobile(true);
        window.onresize = () => {
            let width = window.innerWidth;
            if (width < 900) setIsMobile(true)
            else {
                setIsMobile(false);
            }

        }
    }, [])
    return (
        <Router>
            {isLogged ?
                <div className='mainWrapper'>
                    <div className='leftContainer'>
                        <Nav setLog={() => setIslogged(false)} isMobile={isMobile} />
                    </div>
                    <MobileContext.Provider value={isMobile}>
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
                    </MobileContext.Provider>
                </div> :
                <Login setLog={(email: string) => {
                    setIslogged(true)
                    setEmail(email)
                }} />
            }
        </Router>
    )
}