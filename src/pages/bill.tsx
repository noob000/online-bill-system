import axios from "axios";
import { useState, useEffect, useContext, ReactElement } from 'react';
import { Radio, Timeline, Collapse, Modal, message, Button, Statistic, Row, Col, InputNumber } from 'antd';
import '../style/css/bill.css';
import 'antd/dist/antd.css';
import { MainData, MainDataWithMs } from "../index.d";
import { MobileContext } from "./home";
import FormComponent from "../components/form";
const map = new Map([['food', '饮食'], ['learning', '文教娱乐'], ['sports', '运动健康'], ['transport', '交通出行'], ['communication', '通讯物流'], ['dailylife', '生活日用'], ['dress', '服饰美容'], ['others', '其他消费'], ['salary', '工资'], ['Financing', '理财产品'], ['transfer', '他人转账'], ['others', '其他收入'], ['digitalProduct', '数码电器']])
export default function Bill(props: any) {
    const mobileContext = useContext(MobileContext);
    const [data, setData] = useState<MainData[]>([]);
    const [incomelist, setIncome] = useState<MainDataWithMs[]>([]);
    const [expendlist, setExpend] = useState<MainDataWithMs[]>([]);
    const [incomeOrder, setIncomeOrder] = useState<ReactElement[]>([]);
    const [expendOrder, setExpendOrder] = useState<ReactElement[]>([]);
    const [incomeReverse, setIncomeReverse] = useState<ReactElement[]>([]);
    const [expendReverse, setExpendReverse] = useState<ReactElement[]>([]);
    const [monthIncome, setMonthIncome] = useState<ReactElement[]>([]);
    const [monthExpend, setMonthExpend] = useState<ReactElement[]>([]);
    const [incomeSum, setIncomeSum] = useState<number>(0);
    const [expendSum, setExpendSum] = useState<number>(0);
    const [listCatagory, setListCatagory] = useState<string>('reverse');
    const [mobileHistoryListOrder, setMobileHistoryListOrder] = useState<ReactElement[]>([]);
    const [mobileHistoryListReverse, setMobileHistoryListReverse] = useState<ReactElement[]>([]);
    const [mobileMonthList, setMobileMonthList] = useState<ReactElement[]>([]);
    const [fixModalVisible, setFixModalVisible] = useState<boolean>(false);
    const [fixData, setFixedData] = useState<any>({});
    const [delModalVisible, setDelModalVisible] = useState<boolean>(false);
    const [delData, setDelData] = useState<any>({});
    const [budget, setBudget] = useState<number>(2000);
    const [budgetModalVisible, setBudgetModalVisible] = useState<boolean>(false);
    const [inputBudget, setInputBudget] = useState<number>(budget);

    const fixBudget = () => {
        if (inputBudget != null) {
            axios({
                method: 'post',
                url: 'https://qca83o.fn.thelarkcloud.com/fixBudget',
                data: {
                    email: props.email,
                    budget: inputBudget
                }
            }).then((res) => {
                if (res.data.text === 'success to fix budget') {
                    message.success('成功修改预算');
                    setBudget(inputBudget);
                    setBudgetModalVisible(false);
                }
                else message.error('遇到错误，修改预算失败');
            })
        }
        else message.error('请正确输入您的预算');
    }

    const handleFix = (element: any) => {
        setFixModalVisible(true);
        setFixedData(element);
    }

    const handleDelete = () => {
        setDelModalVisible(false)
        axios({
            method: 'post',
            url: 'https://qca83o.fn.thelarkcloud.com/deleteBillData',
            data: {
                email: props.email,
                data: delData
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.text === 'success to delete') message.success('删除数据成功请刷新页面以显示最新数据');
            else message.error('删除数据失败')
        })
    }

    const refreshData = (newData: any) => {
        axios({
            url: 'https://qca83o.fn.thelarkcloud.com/fixBillData',
            method: 'post',
            data: {
                email: props.email,
                oldData: fixData,
                newData: newData
            }
        }).then((res) => {
            if (res.data.text === 'success') {
                message.success('成功修改数据');
                setFixModalVisible(false);
                setFixedData({});
            }
            else {
                message.error('修改数据发生错误，请注意格式再次尝试');
                setFixModalVisible(false);
                setFixedData({});
            }
        })
    }
    useEffect(() => {
        if (props.email) {
            axios({
                url: "https://qca83o.fn.thelarkcloud.com/getUserData",
                method: 'post',
                data: {
                    email: props.email
                }
            }).then((res) => {
                let billData = res.data.data;
                setData(billData);

            })
        }

    }, [props, fixModalVisible])

    useEffect(() => {
        let templist1 = [], templist2 = [], templist3: any = [];
        for (let element of data) {
            let date = new Date(element.dateObject);
            let ms = date.getTime();
            templist3.push(Object.assign(element, { ms: ms }))
        }

        for (let ele of templist3) {
            if (ele.cata === 'income') templist1.push(ele);
            else if (ele.cata === 'expend') templist2.push(ele)
        }
        setIncome(templist1);
        setExpend(templist2);


        for (let i = 0, l = templist3.length; i < l; i++) {
            let minIndex = i;
            for (let j = i + 1; j < l; j++) {
                if (templist3[minIndex].ms > templist3[j].ms) {
                    minIndex = j;
                }
            }
            let temp: any = templist3[minIndex];
            templist3[minIndex] = templist3[i];
            templist3[i] = temp;
        }//得到排序后不分cata的数据


        let orderHistoryList = templist3.map((element: any) =>
            <Timeline.Item color={element.cata === 'income' ? 'green' : 'blue'}>

                <div className='billFlexContainer'>
                    <div>
                        <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                        <span style={{ paddingRight: '1rem' }}>{element.cata==='income'?'收入':'支出'}</span>
                        <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                        <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                        <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>
                    </div>
                    <div className='buttonContainer'>
                        <Button className='fixButton' onClick={() => handleFix(element)} danger>修改</Button>
                        <Button className='delButton' onClick={() => { setDelModalVisible(true); setDelData(element) }} danger>删除</Button>
                    </div>
                </div>

            </Timeline.Item>);
        let reverseHistoryList: ReactElement[] = [];
        for (let l = orderHistoryList.length - 1; l >= 0; l--) reverseHistoryList.push(orderHistoryList[l]);
        setMobileHistoryListOrder(orderHistoryList);
        setMobileHistoryListReverse(reverseHistoryList);
        let mobileMonthList: ReactElement[] = [];
        templist3.forEach((element: any) => {
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth();
            let tempDate = new Date(element.dateObject);
            if (tempDate.getMonth() === currentMonth && currentYear === tempDate.getFullYear()) {
                let temp =
                    <Timeline.Item color={element.cata === 'income' ? 'green' : 'blue'}>
                        <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                        <span style={{ paddingRight: '1rem' }}>{element.cata === 'income' ? '收入' : '支出'}</span>
                        <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                        <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                        <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>
                    </Timeline.Item>;
                mobileMonthList.push(temp);
            }
        });
        setMobileMonthList(mobileMonthList);//移动端本月账单不分cata
    }, [data])

    useEffect(() => {
        let templist1 = [], templist2 = [], templist3 = [], templist5 = [], sum = 0;//1用来存放顺序数组，2用来存放顺序账单div
        for (let element of incomelist) {
            templist1.push(element)
        }
        for (let i = 0, l = templist1.length; i < l; i++) {
            let minIndex = i;
            for (let j = i + 1; j < l; j++) {
                if (templist1[minIndex].ms > templist1[j].ms) {
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
                    <div className='billFlexContainer'>
                        <div>
                            <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                            <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                            <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                            <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>
                        </div>
                        <div className='buttonContainer'>
                            <Button className='fixButton' onClick={() => handleFix(element)} danger>修改</Button>
                            <Button className='delButton' onClick={() => { setDelModalVisible(true); setDelData(element) }} danger>删除</Button>
                        </div>
                    </div>
                </Timeline.Item>

            templist2.push(temp);
        }
        setIncomeOrder(templist2);
        for (let l = templist2.length - 1; l >= 0; l--) templist3.push(templist2[l])
        setIncomeReverse(templist3);
        for (let element of templist1) {
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth();
            let tempDate = new Date(element.dateObject);
            if (tempDate.getMonth() === currentMonth && currentYear === tempDate.getFullYear()) {
                let temp =
                    <Timeline.Item color='blue'>
                        <div>

                            <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                            <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                            <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                            <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>

                        </div>
                    </Timeline.Item>;
                templist5.push(temp);
                sum += element.amount;
            }
        }
        setMonthIncome(templist5);
        setIncomeSum(sum);//接下来实现移动端列表

    }, [incomelist])

    useEffect(() => {
        let templist1 = [], templist2 = [], templist3 = [], templist5 = [], sum = 0;
        for (let element of expendlist) {
            templist1.push(element)
        }
        for (let i = 0, l = templist1.length; i < l; i++) {
            let minIndex = i;
            for (let j = i + 1; j < l; j++) {
                if (templist1[minIndex].ms > templist1[j].ms) {
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
                    <div className='billFlexContainer'>
                        <div>
                            <span style={{ paddingRight: '1rem' }}>{element.date}</span>
                            <span style={{ paddingRight: '1rem' }}>{map.get(element.catagory)}</span>
                            <span style={{ paddingRight: '1rem' }}>{element.amount}元</span>
                            <div style={{ paddingTop: '0.5rem' }}>{element.note === '' ? '备注：无' : `备注：${element.note}`}</div>
                        </div>
                        <div className='buttonContainer'>
                            <Button className='fixButton' onClick={() => handleFix(element)} danger>修改</Button>
                            <Button className='delButton' onClick={() => { setDelModalVisible(true); setDelData(element) }} danger>删除</Button>
                        </div>
                    </div>
                </Timeline.Item >

            templist2.push(temp);
        }
        setExpendOrder(templist2);
        for (let l = templist2.length - 1; l >= 0; l--) templist3.push(templist2[l])
        setExpendReverse(templist3);
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

    useEffect(() => {
        if (props.email) {
            axios({
                url: 'https://qca83o.fn.thelarkcloud.com/getBudget',
                method: 'post',
                data: {
                    email: props.email
                }
            }).then((res) => {
                setBudget(res.data.budget);
            })
        }

    }, [props, budgetModalVisible])
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
                    {mobileContext ?
                        <div className='mobileBillContainer'>
                            <Timeline>
                                {listCatagory === 'reverse'
                                    ? mobileHistoryListReverse
                                    : mobileHistoryListOrder
                                }
                            </Timeline>
                        </div>
                        : <div className='billContainer'>
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
                        </div>}
                </Collapse.Panel>
                <Collapse.Panel header='本月收支情况' key={2}>
                    {mobileContext
                        ? <div className='mobileBillContainer'>
                            <Timeline>
                                {mobileMonthList}
                            </Timeline>
                            <div style={{ paddingTop: '1rem' }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic title="本月预算" value={budget} suffix="元" />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="本月支出" value={expendSum} suffix="元" />
                                    </Col>
                                </Row>
                                <Button type='primary' onClick={() => setBudgetModalVisible(true)}>修改预算</Button>
                            </div>
                        </div>
                        : <div className='billContainer'>
                            <div className='list_Container'>
                                <h2>收入</h2>
                                <Timeline>
                                    {monthIncome}
                                </Timeline>
                                <Col span={12}>
                                    <Statistic title="本月收入" value={incomeSum} suffix="元" />
                                </Col>

                            </div>
                            <div className='list_Container'>
                                <h2>支出</h2>
                                <Timeline>
                                    {monthExpend}
                                </Timeline>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic title="本月预算" value={budget} suffix="元" />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="本月支出" value={expendSum} suffix="元" />
                                    </Col>
                                </Row>
                                <Button type='primary' onClick={() => setBudgetModalVisible(true)}>修改预算</Button>
                            </div>
                        </div>}
                </Collapse.Panel>
            </Collapse>
            <Modal title={'修改账单'}
                visible={fixModalVisible}
                onCancel={() => { setFixModalVisible(false); setFixedData({}) }}
                okText={null}
                footer={null}
            >
                <FormComponent state={'modify'}
                    modifyData={fixData}
                    buttonValue={'修改'}
                    clickCallBack={refreshData} />
            </Modal>
            <Modal title={'删除账单'}
                visible={delModalVisible}
                onCancel={() => { setDelModalVisible(false); setDelData({}) }}
                onOk={() => handleDelete()}>
                <p>请确认您的确要删除这条账单，一旦删除将无法恢复！</p>
            </Modal>
            <Modal title={'修改预算'}
                visible={budgetModalVisible}
                onCancel={() => setBudgetModalVisible(false)}
                onOk={fixBudget}
                okText={'提交修改'}
                cancelText={'取消修改'}
            >
                <InputNumber prefix="￥" onChange={(value: any) => setInputBudget(value)} />
            </Modal>
        </div>
    )
}