import { useState, useEffect } from "react";
import Mock from "mockjs";
import axios from "axios";
import { Select, Collapse } from "antd";
import PieChart from "./Piechart";
import MonthlyChart from "./monthlychart";
import YearlyChart from "./yearlychart";
import { MainData,YearSortedData } from "./index.d";

const data1 = [{
    "date": "2021-7-14",
    "catagory": "Financing",
    "cata": "income",
    "amount": 32,
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
},
{
    "date": "2021-6-7",
    "catagory": "Financing",
    "cata": "income",
    "amount": 456,
    "note": "asdasdasd",
    "dateObject": "2021-06-07T11:29:54.961Z"
},
{
    "date": "2021-7-7",
    "catagory": "transfer",
    "cata": "income",
    "amount": 456.3,
    "note": "45646464",
    "dateObject": "2021-07-07T11:31:18.705Z"
}, {
    "date": "2021-7-28",
    "catagory": "others",
    "cata": "income",
    "amount": 789,
    "note": "4564645",
    "dateObject": "2021-07-28T11:31:30.345Z"
},
{
    "date": "2021-7-1",
    "catagory": "Financing",
    "cata": "income",
    "amount": 89.3,
    "note": "",
    "dateObject": "2021-07-01T11:31:43.968Z"
}
]
const map = new Map([['food', '饮食'], ['learning', '文教娱乐'], ['sports', '运动健康'], ['transport', '交通出行'], ['communication', '通讯物流'], ['dailylife', '生活日用'], ['dress', '服饰美容'], ['others', '其他消费'], ['salary', '工资'], ['Financing', '理财产品'], ['transfer', '他人转账'], ['others', '其他收入']])
export default function Analysis(props:any) {
    const [data, setData] = useState<MainData []>([]);
    const [yearList, setYearList] = useState<number []>([]);
    const [data_year, setdata_year] = useState<YearSortedData []>([]);
    const [year, setYear] = useState<number>(2021);
    const [chartOption, setChartOptions] = useState<any>({});
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
        let data_year = [], yearlist = [];
        for (let element of data) {
            let year = new Date(element.dateObject).getFullYear();
            if (data_year.length == 0) {
                let item = {
                    year: year,
                    data: [element]
                }
                data_year.push(item);
                yearlist.push(year);
            }
            else {
                let i = 0, l = yearlist.length, state = true;
                while (i < l && state) {
                    if (data_year[i].year == year) {
                        let newItem: any = {
                            year: year,
                            data: [...data_year[i].data, ...[element]]
                        }
                        data_year[i] = newItem;
                        state = false
                    }
                    else i++;
                }
                if (state) {
                    yearlist.push(year);
                    data_year.push({
                        year: year,
                        data: [element]
                    })
                }
            }
        }//得到一个只有年份的数组当作下拉列表的数据，并且得到按年份收纳的数据数组
        setdata_year(data_year);
        setYearList(yearlist);
    }, [data]);
    return (
        <div>'
            <div>
                <Collapse style={{ width: '100%' }}>
                    <Collapse.Panel header='收入支出分类占比' key={1}>
                        <Select placeholder='请选择年份' onChange={(year: any) => setYear(year)} defaultValue={2021}>
                            {yearList.map((element: any) => <Select.Option value={element}>{element}</Select.Option>)}
                        </Select>
                        <div className='chartContainer'>
                            <PieChart data={data_year} year={year} />
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header='年度收入支出趋势分析' key={2}>
                        <YearlyChart data={data_year} yearlist={yearList} />
                    </Collapse.Panel>
                    <Collapse.Panel header='月份收入支出趋势分析' key={3}>
                        <MonthlyChart data={data_year} year={year} />
                    </Collapse.Panel>

                </Collapse>

            </div>
        </div>
    )
}










{/*useEffect(() => {
        let tempData = [], tempDataIncome = [], tempDataExpend = [], incomeCatagorySorted: any = [], expendCatagorySorted: any = [];//用于储存目标年份的相关账单
        let incomeSum = 0, expendSum = 0;//各类总和
        let incomeOption = {}, expendOption = {};
        let incomeCatagory:any = [], expendCatagory:any = [];
        for (let element of data_year) {
            if (element.year === year) tempData = element.data;
        }
        for (let element of tempData) {
            if (element.cata === 'income') tempDataIncome.push(element);
            else tempDataExpend.push(element)
        };
        let expendState = false;
        for (let element of tempDataIncome) {
            let elementInArr = false
            if (incomeCatagorySorted.length == 0) incomeCatagorySorted.push({
                catagory: element.catagory,
                data: [element]
            })
            else {
                for (let i = 0, l = incomeCatagorySorted.length; i < l; i++) {
                    if (incomeCatagorySorted[i].catagory == element.catagory) {
                        incomeCatagorySorted[i] = {
                            catagory: element.catagory,
                            data: [...incomeCatagorySorted[i].data, ...[element]]
                        }
                        elementInArr = true
                    }
                }
                if (!elementInArr) incomeCatagorySorted.push({
                    catagory: element.catagory,
                    data: [element]
                })
            }
        }//得到按类型归纳的数据数组

        for (let element of incomeCatagorySorted) incomeSum += element.data.length;
        for (let i=0,l=incomeCatagorySorted.length;i<l;i++) {
            incomeCatagory.push(incomeCatagorySorted[i].catagory);
            Object.defineProperty(incomeOption,incomeCatagorySorted[i].catagory,{
                value:incomeCatagorySorted[i].data.length/incomeSum
            })
        }


    }, [yearList])
    */}