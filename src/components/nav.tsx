import { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import '../style/css/nav.css';
import { Drawer } from 'antd';
import { AlignLeftOutlined } from '@ant-design/icons'
export default function Nav(props: any) {
    const [route, setRoute] = useState<string>('add');
    const [mobTitle, setMobTitle] = useState<string>('增加/修改支出或收入');
    const [drawerVisibile, setDrawerVisibile] = useState<boolean>(false);
    useEffect(() => {
        setDrawerVisibile(false)
    }, [props])
    const mobileNav =
        <div className='mobileNavContainer'>
            <AlignLeftOutlined onClick={() => setDrawerVisibile(true)} className='drawerButton' />
            <span className='mobTitle'>{mobTitle}</span>
        </div>


    const drawer =
        <Drawer
            visible={drawerVisibile}
            placement={'left'}
            title={mobTitle}
            closable={true}
            onClose={() => setDrawerVisibile(false)}
            className='isShow'>
            <div className='leftNav'>
                <ul style={{ paddingLeft: '0' }}>
                    <li className={classnames({
                        selectedLi: route === 'add'
                    })} onClick={() => {
                        setRoute('add');
                        setDrawerVisibile(false);
                        setMobTitle('增加/修改支出或收入')
                    }}>
                        <Link to='/'>增加/修改支出或收入</Link></li>
                    <li className={classnames({
                        selectedLi: route === 'bill'
                    })} onClick={() => {
                        setRoute('bill');
                        setDrawerVisibile(false);
                        setMobTitle('浏览账单')
                    }}><Link to='/mybill'>浏览账单</Link></li>
                    <li className={classnames({
                        selectedLi: route === 'analysis'
                    })} onClick={() => {
                        setRoute('analysis');
                        setDrawerVisibile(false);
                        setMobTitle('账单分析')
                    }}><Link to='/analysis'>账单分析</Link></li>
                </ul>
                <p className='logoutButton' onClick={props.setLog} style={{ paddingLeft: '0' }}>退出登录</p>
            </div>
        </Drawer>
    return (
        <>
            {mobileNav}
            <div className='navContainer'>
                <ul>
                    <li className={classnames({
                        selectedLi: route === 'add'
                    })} onClick={() => setRoute('add')}>
                        <Link to='/'>添加支出/收入</Link></li>
                    <li className={classnames({
                        selectedLi: route === 'bill'
                    })} onClick={() => setRoute('bill')}><Link to='/mybill'>浏览账单</Link></li>
                    <li className={classnames({
                        selectedLi: route === 'analysis'
                    })} onClick={() => setRoute('analysis')}><Link to='/analysis'>账单分析</Link></li>
                </ul>
                <p className='logoutButton' onClick={props.setLog}>退出登录</p>
            </div>
            {drawer}
        </>

    )
}