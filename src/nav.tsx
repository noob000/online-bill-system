import { useState } from 'react';
import classnames from 'classnames';
import {
    Link
} from "react-router-dom";
import './style/css/nav.css';
export default function Nav(props:any) {
    const [route,setRoute] = useState('add');
    return (
       
            <div className='navContainer'>
                <ul>
                    <li className={classnames({
                        selectedLi:route==='add'
                    })} onClick={()=>setRoute('add')}>
                        <Link to='/'>添加支出/收入</Link></li>
                    <li className={classnames({
                        selectedLi:route==='bill'
                    })} onClick={()=>setRoute('bill')}><Link to='/mybill'>浏览账单</Link></li>
                    <li className={classnames({
                        selectedLi:route==='analysis'
                    })} onClick={()=>setRoute('analysis')}><Link to='/analysis'>浏览账单</Link></li>
                </ul>
                <p className='logoutButton' onClick={props.setLog}>退出登录</p>
            </div>
       
    )
}