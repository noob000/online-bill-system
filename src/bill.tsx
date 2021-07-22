import axios from "axios";
import { useState, useEffect } from 'react';
import { Radio, Timeline, Collapse } from 'antd';
import Mock from 'mockjs';
import './style/css/bill.css';
import { MainData } from "./index.d";
const data1 = [{
    "date": "2021-7-14",
    "catagory": "Financing",
    "cata": "income",
    "amount": 2132,
    "note": "132123",
    "dateObject": "2021-07-14T01:44:55.086Z"
}, {
    "date": "2021-7-3",
    "catagory": "others",
    "cata": "income",
    "amount": 3123,
    "note": "123131",
    "dateObject": "2021-07-03T01:45:05.592Z"
}, {
    "date": "2022-7-16",
    "catagory": "transfer",
    "cata": "income",
    "amount": 1313,
    "note": "",
    "dateObject": "2022-07-16T01:45:12.938Z"
}, {
    "date": "2021-7-12",
    "catagory": "dailylife",
    "cata": "expend",
    "amount": 3.2,
    "note": "",
    "dateObject": "2021-07-12T01:45:28.419Z"
}, {
    "date": "2021-7-20",
    "catagory": "others",
    "cata": "expend",
    "amount": 5.2,
    "note": "",
    "dateObject": "2021-07-20T01:45:37.802Z"
}]
const map = new Map([['food', '饮食'], ['learning', '文教娱乐'], ['sports', '运动健康'], ['transport', '交通出行'], ['communication', '通讯物流'], ['dailylife', '生活日用'], ['dress', '服饰美容'], ['others', '其他消费'], ['salary', '工资'], ['Financing', '理财产品'], ['transfer', '他人转账'], ['others', '其他收入']])
export default function Bill(props:any) {
    const [data, setData] = useState<MainData []>([]);
    const [incomelist, setIncome] = useState<MainData []>([]);
    const [expendlist, setExpend] = useState<MainData []>([]);
    const [incomeOrder, setIncomeOrder] = useState<any>([]);
    const [expendOrder, setExpendOrder] = useState<any>([]);
    const [incomeReverse, setIncomeReverse] = useState<any>([]);
    const [expendReverse, setExpendReverse] = useState<any>([]);
    const [monthIncome, setMonthIncome] = useState<any>([]);
    const [incomeSum, setIncomeSum] = useState<number>(0);
    const [expendSum, setExpendSum] = useState<number>(0);
    const [monthExpend, setMonthExpend] = useState<any>([]);
    const [listCatagory, setListCatagory] = useState('reverse');
    useEffect(() => {
        Mock.mock('https://qcq4tc.fn.thelarkcloud.com/billData', 'post', function (options: any) {
            return data1;
        });
        axios({
            url: "https://qcq4tc.fn.thelarkcloud.com/billData",
            method: 'post'
        }).then((res) => {
            let billData = res.data;
            setData(billData);

        })
    }, [])
    useEffect(() => {
        let templist1 = [], templist2 = [];
        for (let ele of data) {
            if (ele.cata === 'income') templist1.push(ele);
            else if (ele.cata === 'expend') templist2.push(ele)
        }
        setIncome(templist1);
        setExpend(templist2);
    }, [data])
    useEffect(() => {
        let templist1 = [], templist2 = [], templist3 = [], templist4 = [], templist5 = [], sum = 0;
        for (let element of incomelist) {
            let date = new Date(element.dateObject);
            let ms = date.getTime();
            templist1.push(Object.assign(element, { ms: ms }))
        }
        for (let i = 0, l = templist1.length; i < l; i++) {
            let minIndex = i;
            for (let j = i + 1; j < l; j++) {
                if (templist1[i].ms > templist1[j].ms) {
                    minIndex = j;
                }
            }
            let temp: any = templist1[minIndex];
            templist1[minIndex] = templist1[i];
            templist1[i] = temp;
        }
        for (let element of templist1) {
            let temp =
                <Timeline.Item color='blue'>

                    <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                    <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                    <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                    <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>

                </Timeline.Item>

            templist2.push(temp);
        }
        setIncomeOrder(templist2);
        for (let l = templist1.length - 1; l >= 0; l--) templist3.push(templist1[l]);
        for (let element of templist3) {
            let temp =
                <Timeline.Item color='blue'>

                    <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                    <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                    <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                    <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>

                </Timeline.Item>;
            templist4.push(temp);
        }
        setIncomeReverse(templist4);
        for (let element of templist1) {
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth();
            let tempDate = new Date(element.dateObject);
            if (tempDate.getMonth() === currentMonth && currentYear === tempDate.getFullYear()) {
                let temp =
                    <Timeline.Item color='blue'>
                        <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                        <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                        <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                        <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>
                    </Timeline.Item>;
                templist5.push(temp);
                sum += element.amount;
            }
        }
        setMonthIncome(templist5);
        setIncomeSum(sum);

    }, [incomelist])
    useEffect(() => {
        let templist1 = [], templist2 = [], templist3 = [], templist4 = [], templist5 = [], sum = 0;
        for (let element of expendlist) {
            let date = new Date(element.dateObject);
            let ms = date.getTime();
            templist1.push(Object.assign(element, { ms: ms }))
        }
        for (let i = 0, l = templist1.length; i < l; i++) {
            let minIndex = i;
            for (let j = i + 1; j < l; j++) {
                if (templist1[i].ms > templist1[j].ms) {
                    minIndex = j;
                }
            }
            let temp: any = templist1[minIndex];
            templist1[minIndex] = templist1[i];
            templist1[i] = temp;
        }
        for (let element of templist1) {
            let temp =
                <Timeline.Item color='green'>

                    <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                    <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                    <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                    <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>

                </Timeline.Item >

            templist2.push(temp);
        }
        setExpendOrder(templist2);
        for (let l = templist1.length - 1; l >= 0; l--) templist3.push(templist1[l]);
        for (let element of templist3) {
            let temp =
                <Timeline.Item color='green'>

                    <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                    <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                    <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                    <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>

                </Timeline.Item>

            templist4.push(temp);
        }
        setExpendReverse(templist4);
        for (let element of templist1) {
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth();
            let tempDate = new Date(element.dateObject);
            if (tempDate.getMonth() === currentMonth && currentYear === tempDate.getFullYear()) {
                let temp =
                    <Timeline.Item color='green'>

                        <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                        <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                        <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                        <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>

                    </Timeline.Item>;
                templist5.push(temp);
                sum += element.amount;
            }
        }
        setExpendSum(sum);
        setMonthExpend(templist5);
    }, [expendlist])
    return (
        <div>
            <Collapse style={{ width: '100%' }}>
                <Collapse.Panel header='历史账单' key={1}>
                    <div className='radioContainer'>
                        <Radio.Group defaultValue={listCatagory} onChange={(event: any) => setListCatagory(event.target.value)}>
                            <Radio value='order'>按时间正序显示账单</Radio>
                            <Radio value='reverse'>按时间倒序显示账单</Radio>
                        </Radio.Group>
                    </div>
                    <div className='billContainer'>
                        <div className='list_Container'>
                            <h2>收入</h2>
                            <Timeline>
                                {listCatagory === 'reverse' ? incomeReverse : incomeOrder}
                            </Timeline>
                        </div>
                        <div className='list_Container'>
                            <h2>支出</h2>
                            <Timeline>
                                {listCatagory === 'reverse' ? expendReverse : expendOrder}
                            </Timeline>
                        </div>
                    </div>
                </Collapse.Panel>
                <Collapse.Panel header='本月收支情况' key={2}>
                    <div className='billContainer'>
                        <div className='list_Container'>
                            <h2>收入</h2>
                            <Timeline>
                                {monthIncome}
                            </Timeline>
                            <p>本月总收入为 ：{incomeSum}元</p>
                        </div>
                        <div className='list_Container'>
                            <h2>支出</h2>
                            <Timeline>
                                {monthExpend}
                            </Timeline>
                            <p>本月总支出为 ：{expendSum}元</p>
                        </div>
                    </div>
                </Collapse.Panel>
            </Collapse>

        </div>
    )
}