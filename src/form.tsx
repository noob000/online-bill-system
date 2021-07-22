import { useEffect, useRef, useState } from "react";
import { Form, DatePicker, Select, Input, Radio, Button, InputNumber,message } from 'antd';
import 'antd/dist/antd.css';
import moment from "moment";
export default function FormComponent(props: any) {
    const [fields, setFields] = useState<any>([{
        name: 'cata',
        value: 'income'
    }]);
    const formRef: any = useRef(null)
    const [date, setDate] = useState<any>('');
    const [catagory, setCatagory] = useState<any>('');
    const [amount, setAmount] = useState(0);
    const [cata, setCata] = useState('income');
    const [note, setNote] = useState('');
    const handleClick = () => {
        if(date!=''&&amount!=0){
            let dateData = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                weekday: date.getDay()
            }
            const tempDate = `${dateData.year}` + '-' + `${dateData.month}` + '-' + `${dateData.day}`
            let result = [{
                date: tempDate,
                catagory: catagory,
                cata: cata,
                amount: amount,
                note: note,
                dateObject:date
            }];
            props.setData(result);
            setDate('');
            setCata('income');
            setAmount(0);
            setCatagory('')
            setNote('');
            formRef.current!.resetFields()
        }
        else{
            message.error('请输入正确格式的信息并填写必要信息！');
            formRef.current!.resetFields()
        }
      
    }

    useEffect(() => {
        if (props.state === 'modify') {
            const data=props.modifyData
            setFields([
                {
                    name: 'note',
                    value:data.note
                },
                {
                    name: 'amount',
                    value: data.amount
                },
                {
                    name: 'catagory',
                    value: data.catagory
                }, {
                    name: 'cata',
                    value: data.cata
                }, {
                    name: 'date',
                    value: moment(data.date, 'YYYY/MM/DD')
                }
            ])
            setDate(data.dateObject);
            setCata(data.cata);
            setCatagory(data.catagory);
            setAmount(data.amount);
            setNote(data.note);
        }
        else if (props.state === 'add') {
            setFields([
                {
                    name: 'cata',
                    value: 'income'
                }
            ])
        }
    }, [props])
    const expendSelect = <Select placeholder={'请输入您的消费类别'} onChange={(value: any) => setCatagory(value)}>
        <Select.Option value='food'>饮食</Select.Option>
        <Select.Option value='learning'>文教娱乐</Select.Option>
        <Select.Option value='sports'>运动健康</Select.Option>
        <Select.Option value='transport'>交通出行</Select.Option>
        <Select.Option value='communication'>通讯物流</Select.Option>
        <Select.Option value='dailylife'>生活日用</Select.Option>
        <Select.Option value='dress'>服饰美容</Select.Option>
        <Select.Option value='others'>其他消费</Select.Option>
    </Select>
    const incomeSelect = <Select placeholder={'请输入您的收入类别'} onChange={(value: any) => setCatagory(value)}>
        <Select.Option value='salary'>工资</Select.Option>
        <Select.Option value='Financing'>理财产品</Select.Option>
        <Select.Option value='transfer'>他人转账</Select.Option>
        <Select.Option value='others'>其他收入</Select.Option>

    </Select>
    return (
        <Form fields={fields}
            layout='horizontal'
            onFinish={(value: any) => console.log(value)}
            wrapperCol={{ span: 16 }}
            ref={formRef}
        >
            <Form.Item
                label='日期'
                name='date'
                rules={[{ required: true, message: '请填写记账日期' }]}>
                <DatePicker onChange={(event: any) => {
                    if (event) {
                        let date = event._d;
                        const result = {
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                            weekday: date.getDay()
                        }
                        setDate(event._d)
                    }
                }} />
            </Form.Item>

            <Form.Item required={true} name='cata'>
                <Radio.Group onChange={(event: any) => setCata(event.target.value)} >
                    <Radio.Button value='income'>收入</Radio.Button>
                    <Radio.Button value='expend'>支出</Radio.Button>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                label='收入或支出类别'
                name='catagory'
                rules={[{ required: true, message: '请输入你的收入或支出类别' }]}>
                {cata === 'income' ? incomeSelect : expendSelect}
            </Form.Item>

            <Form.Item
                label='金额'
                name='amount'
                rules={[{ required: true, message: '请输入正确的金额', type: 'number', min: 0 }]} >
                <InputNumber onChange={(value: number) => setAmount(value)} />
            </Form.Item>
            <Form.Item
                label='备注'
                name='note'>
                <Input onChange={(event: any) => setNote(event.target.defaultValue)} placeholder={'备注'} />
            </Form.Item>
            <Form.Item >
                <Button type='primary'
                    onClick={handleClick}
                >添加</Button>
            </Form.Item>
        </Form>
    )
}