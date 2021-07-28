import { ReactElement, useEffect, useState } from "react";
import { Button, Modal, message, notification } from "antd";
import 'antd/dist/antd.css';
import '../style/css/add.css';
import FormComponent from "../components/form";
import axios from "axios";
import { MainData } from "../index.d";
export default function Add(props: any) {
    const map = new Map([['food', '饮食'], ['learning', '文教娱乐'], ['sports', '运动健康'], ['transport', '交通出行'], ['communication', '通讯物流'], ['dailylife', '生活日用'], ['dress', '服饰美容'], ['others', '其他消费'], ['salary', '工资'], ['Financing', '理财产品'], ['transfer', '他人转账'], ['others', '其他收入'], ['digitalProduct', '数码电器']])
    const [data, setData] = useState<MainData[]>([]);
    const [incomelist, setIncome] = useState<ReactElement[]>([]);
    const [expendlist, setExpend] = useState<ReactElement[]>([]);
    const [modifyData, setModify] = useState<any>({});
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [formState, setFormState] = useState<string>('add');
    const handleData = () => {
        axios({
            url: 'https://qca83o.fn.thelarkcloud.com/insertBillData',
            method: 'post',
            data: {
                data: data,
                email: props.email
            }
        }).then((res) => {
            console.log(res)
            if (res.data.text === 'success') {
                setData([])
                setIncome([]);
                setExpend([])
                setModalVisible(false)
                message.success('成功提交数据')
            }
        })
    }
    const handleModify = (index: number) => {
        const target = data[index];
        let temp: MainData[] = [];
        for (let a of data) temp.push(a);
        temp.splice(index, 1);
        setData(temp);
        setModify(target);
        setFormState('modify');
    }
    useEffect(() => {
        if (props.email) {
            axios({
                url: 'https://qca83o.fn.thelarkcloud.com/getBudgetRemind',
                method: 'post',
                data: {
                    email: props.email
                }
            }).then((res) => {
                notification.open({
                    message: '记账提示',
                    description: res.data.text,
                    duration: 2,
                })
            })
        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        let incomelist: any = [], expendlist: any = [];
        data.forEach((element: any, index: number) => {
            if (element.cata === 'income') {
                let temp = [<div className='listItem'>
                    <div>
                        <span>{element.date}</span>
                        <span>{map.get(element.catagory)}</span>
                        <span>{element.amount}元</span>
                        <div>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>
                    </div>
                    <div className='buttonContainer'>
                        <Button type='text' danger onClick={() => handleModify(index)}>修改</Button>
                    </div>
                </div>]
                incomelist.push(temp);
            }
            else {
                let temp = [<div className='listItem'>
                    <div>
                        <span>{element.date}</span>
                        <span>{map.get(element.catagory)}</span>
                        <span>{element.amount}元</span>
                        <div>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>
                    </div>
                    <div className='buttonContainer'>
                        <Button type='text' danger onClick={() => handleModify(index)} >修改</Button>
                    </div>
                </div>]
                expendlist.push(temp);
            }
        })
        setExpend(expendlist);
        setIncome(incomelist);// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    return (
        <div>
            <div className='formContainer'>
                <div className='form'>
                    <FormComponent
                        state={formState}
                        modifyData={modifyData}
                        clickCallBack={(value: any[]) => {
                            let newData = [...data, ...value]
                            setData(newData);
                            setFormState('add')
                        }}
                        buttonValue={'添加'} />
                </div>
            </div>

            <div className='listContainer'>
                <div className='incomeList'>
                    <h2>收入列表</h2>
                    {incomelist}
                </div>
                <div className='expendList'>
                    <h2>支出列表</h2>
                    {expendlist}
                </div>
            </div>
            <Button type='primary' onClick={() => setModalVisible(true)} style={{ display: 'block', margin: '0 auto', marginTop: '2rem' }}>保存至总账单</Button>
            <Modal title='提交确认'
                visible={modalVisible}
                onOk={handleData}
                onCancel={() => setModalVisible(false)}>
                <p>请再次核对保存的数据没有错误哦</p>
            </Modal>

        </div>
    )
}