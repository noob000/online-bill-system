import { useState, useRef } from "react";
import { Form, Input, Button, Checkbox, message, notification } from 'antd';
import axios from "axios";
import 'antd/dist/antd.css';
import '../style/css/login.css';
export default function Login(props: any) {
    const [loginState, setLoginState] = useState<string>('login');
    const [loginEmail, setLoginEmail] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [registEmail, setRegistEmail] = useState<any>('');
    const [registPassword, setRegistPassword] = useState<string>('');
    const loginform: any = useRef(null);
    const registform: any = useRef(null);

    let toId = (str: string) => {
        let result = '';
        for (let i = 0, l = str.length / 2; i < l; i++) {
            result += str[i].charCodeAt(0);
        }
        return result;
    }
    const loginFinish = () => {
        axios({
            url: 'https://qca83o.fn.thelarkcloud.com/loginValidate',
            method: 'post',
            data: {
                type: 'login',
                email: loginEmail,
                password: loginPassword,

            }
        }).then((res) => {
            const text = res.data.text;
            
            if (text === 'success to login') {
                props.setLog(loginEmail);
                axios({
                    url: 'https://qca83o.fn.thelarkcloud.com/getBudgetRemind',
                    method: 'post',
                    data: {
                        email: loginEmail
                    }
                }).then((res) => {
                    notification.open({
                        message: '记账提示',
                        description: res.data.text,
                        duration: 2,
                    })
                })
            }
            else message.error('密码错误')
        })
           
        loginform.current!.resetFields()
    }
    const registFinish = () => {
        axios({
            url: 'https://qca83o.fn.thelarkcloud.com/loginValidate',
            method: 'post',
            data: {
                type: 'regist',
                email: registEmail,
                password: registPassword,
                id: toId(registEmail)
            }
        }).then((res) => {
            const text = res.data.text;
            if (text === 'success to regist') {
                message.success('注册成功');
                setLoginState('login')
            }
            else if (text === 'fail to regist:this email has been registed') message.warning('该账号已被注册，请回到登陆界面登录')

        })
        registform.current!.resetFields()
    }

    const validateMessage = {
        required: '${label}is required',
        types: {
            email: '${label} is not a valid email!',
        },
    }
    const login = <div className='loginContainer'>
        <Form
            ref={loginform}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={loginFinish}
            onFinishFailed={() => console.log('fail')}
            validateMessages={validateMessage}
            validateTrigger={'onFinsh'}
        >
            <Form.Item
                label="邮箱"
                name="username"
                rules={[{ required: true, type: 'email', message: '请正确填写邮箱格式!' }]}
                className='formItem'
            >
                <Input onChange={(event: any) => setLoginEmail(event.target.value)} />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请填写您的密码!' }]}
                className='formItem'
            >
                <Input.Password onChange={(event: any) => setLoginPassword(event.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                   登录
                </Button>
            </Form.Item>
        </Form>
    </div>

    const regist = <div className='registContainer'>
        <Form
            ref={registform}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={registFinish}
            validateMessages={validateMessage}
            validateTrigger={'onFinsh'}
        >
            <Form.Item
                label="邮箱"
                name="username"
                rules={[{ required: true, type: 'email', message: '请正确填写邮箱格式!' }]}
            >
                <Input onChange={(event: any) => setRegistEmail(event.target.value)} />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请填写您的密码!' }]}
            >
                <Input.Password onChange={(event: any) => setRegistPassword(event.target.value)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    注册
                </Button>
            </Form.Item>
        </Form>
    </div>

    return (
        <div className='loginPart'>
            <div className='titleContainer'>
                <h2>{loginState === 'login' ? '请输入邮箱密码进行登录' : '请输入邮箱密码完成注册'}</h2>
                <p onClick={() => setLoginState(loginState === 'login' ? 'regist' : 'login')}>{loginState === 'login' ? '注册帐号' : '登录'}</p>
            </div>
            {loginState === 'login' ? login : regist}
        </div>
    )
}