import { useEffect,useState } from "react";
import { Button, Modal } from "antd";
import 'antd/dist/antd.css';
import './style/css/add.css';
import FormComponent from "./form";
export default function Add(props:any) {
    const map = new Map([['food', '饮食'], ['learning', '文教娱乐'], ['sports', '运动健康'], ['transport', '交通出行'], ['communication', '通讯物流'], ['dailylife', '生活日用'], ['dress', '服饰美容'], ['others', '其他消费'], ['salary', '工资'], ['Financing', '理财产品'], ['transfer', '他人转账'], ['others', '其他收入']])
    const [data, setData] = useState<any>([]);
    const [incomelist, setIncome] = useState([]);
    const [expendlist, setExpend] = useState([]);
    const [modifyData, setModify] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [formState, setFormState] = useState('add');
    const handleModify = (index: number) => {
        const target = data[index];
        let temp = [];
        for (let a of data) temp.push(a);
        temp.splice(index, 1);
        setData(temp);
        setModify(target);
        setFormState('modify');
    }
    useEffect(() => {
        let incomelist: any = [], expendlist: any = [];
        data.map((element: any, index: number) => {
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
        setIncome(incomelist);
    }, [data])
    return (
        <div>
            <div className='formContainer'>
                <div className='form'>
                    <FormComponent
                        state={formState}
                        modifyData={modifyData}
                        setData={(value: any[]) => {
                            let newData = [...data, ...value]
                            setData(newData);
                            setFormState('add')
                        }} />
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
            <Button type='primary' onClick={() => setModalVisible(true)}>保存至总账单</Button>
            <Modal title='提交确认'
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}>
                <p>请确认保存的数据没有错误哦</p>
            </Modal>

        </div>
    )
}