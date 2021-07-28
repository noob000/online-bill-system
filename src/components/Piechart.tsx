import { useEffect, useState } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import '../style/css/piechart.css';
import { YearSortedData, MainData } from '../index.d';
const color: any = Highcharts.getOptions().colors;
const map = new Map([['food', '饮食'], ['learning', '文教娱乐'], ['sports', '运动健康'], ['transport', '交通出行'], ['communication', '通讯物流'], ['dailylife', '生活日用'], ['dress', '服饰美容'], ['others', '其他消费'], ['salary', '工资'], ['Financing', '理财产品'], ['transfer', '他人转账'], ['others', '其他收入'], ['digitalProduct', '数码电器']])
interface PieChartProps {
    data: YearSortedData[],
    year: number
}

export default function PieChart(props: PieChartProps) {
    const [incomeData, setIncomeData] = useState<MainData[]>([]);
    const [expendData, setExpendData] = useState<MainData[]>([]);
    const [incomeOptions, setIncomeOptions] = useState<any>({})
    const [expendOptions, setExpendOptions] = useState<any>({})
    useEffect(() => {
        if (props.data.length > 0) {
            let year = props.year;
            let data = props.data.filter((element: any) => element.year === year
            )[0].data
            let incomelist = [], expendlist = [];
            for (let element of data) {
                if (element.cata === 'income') incomelist.push(element);
                else if (element.cata === 'expend') expendlist.push(element);
            }
            setIncomeData(incomelist);
            setExpendData(expendlist);

        }
    }, [props])//得到按分类归纳的数据
    useEffect(() => {
        if (incomeData.length > 0) {
            let dataCatagorySorted: any = [];
            let sum = 0;
            for (let k = 0, L = incomeData.length; k < L; k++) {
                sum += incomeData[k].amount;
                let state = true;
                if (dataCatagorySorted.length === 0) {
                    dataCatagorySorted.push(
                        {
                            catagory: incomeData[0].catagory,
                            sum: incomeData[0].amount
                        })
                    state = false;
                }
                else {
                    for (let i = 0, l = dataCatagorySorted.length; i < l && state; i++) {
                        if (dataCatagorySorted[i].catagory === incomeData[k].catagory) {
                            dataCatagorySorted[i] = {
                                catagory: dataCatagorySorted[i].catagory,
                                sum: (dataCatagorySorted[i].sum + incomeData[k].amount)
                            }
                            state = false
                        }
                    }
                }
                if (state) {
                    dataCatagorySorted.push({
                        catagory: incomeData[k].catagory,
                        sum: incomeData[k].amount
                    })
                }
            };//得到按收入类型归纳的收入分类总和
            let tempData = [], tempSum: number = 0;
            for (let i = 0, l = dataCatagorySorted.length; i < l; i++) {
                let element = dataCatagorySorted[i];
                if (i !== (l - 1)) {
                    tempData.push({
                        name: map.get(element.catagory),
                        y: parseFloat(((element.sum / sum) * 100).toFixed(2)),
                        color: color[i]
                    })
                    tempSum += parseFloat(((element.sum / sum) * 100).toFixed(2));
                }
                else {
                    tempData.push({
                        name: map.get(element.catagory),
                        y: parseFloat((100 - tempSum).toFixed(2)),
                        color: color[i]
                    })
                }

            }//得到图标所需百分比对应分类的数组
            const options =
            {
                title: {
                    text: `${props.year}年度收入分类占比`
                },
                tooltip: {
                    valueSuffix: '%'
                },
                series: [{
                    name: '收入占比',
                    type: 'pie',
                    innerSize: '0',
                    data: tempData,
                    dataLabels: {
                        softConnecter: false,
                        distance: 20,
                        connectorPadding: 20,
                        formatter: function (this: any) {
                            return `${this.point.name}占比:${this.y}%`
                        }
                    }
                }]
            }
            setIncomeOptions(options)
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incomeData])
    useEffect(() => {
        if (expendData.length > 0) {
            let dataCatagorySorted: any = [];
            let sum = 0;
            for (let k = 0, L = expendData.length; k < L; k++) {
                sum += expendData[k].amount;
                let state = true
                if (dataCatagorySorted.length === 0) {
                    dataCatagorySorted.push(
                        {
                            catagory: expendData[k].catagory,
                            sum: expendData[k].amount
                        })
                    state = false
                }

                else {
                    for (let i = 0, l = dataCatagorySorted.length; i < l && state; i++) {
                        if (dataCatagorySorted[i].catagory === expendData[k].catagory) {
                            dataCatagorySorted[i] = {
                                catagory: dataCatagorySorted[i].catagory,
                                sum: dataCatagorySorted[i].sum + expendData[k].amount
                            }
                            state = false
                        }
                    }
                }
                if (state) {
                    dataCatagorySorted.push({
                        catagory: expendData[k].catagory,
                        sum: expendData[k].amount
                    })
                }
            };//得到按收入类型归纳的收入分类总和

            let tempData = [], tempSum: number = 0;
            for (let i = 0, l = dataCatagorySorted.length; i < l; i++) {
                let element = dataCatagorySorted[i];
                if (i !== (l - 1)) {
                    tempData.push({
                        name: map.get(element.catagory),
                        y: parseFloat(((element.sum / sum) * 100).toFixed(2)),
                        color: color[i]
                    })
                    tempSum += parseFloat(((element.sum / sum) * 100).toFixed(2));
                }
                else {
                    tempData.push({
                        name: map.get(element.catagory),
                        y: parseFloat((100 - tempSum).toFixed(2)),
                        color: color[i]
                    })
                }

            }//得到图标所需百分比对应分类的数组
            const options =
            {
                title: {
                    text: `${props.year}年度支出分类占比`
                },
                tooltip: {
                    valueSuffix: '%'
                },
                series: [{
                    name: '支出占比',
                    type: 'pie',
                    innerSize: '0',
                    data: tempData,
                    dataLabels: {
                        softConnecter: false,
                        distance: 20,
                        connectorPadding: 20,
                        formatter: function (this: any) {
                            return `${this.point.name}占比:${this.y}%`
                        }
                    }
                }]
            }
            setExpendOptions(options)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expendData])
    return (
        <>
            <div className='pieChartFlexContainer'>
                <div className='pieChartContainer'>
                    {incomeData.length > 0 ? <HighchartsReact highcharts={Highcharts} options={incomeOptions} /> : <p>数据不够，暂无法生成图表</p>}
                </div>
                <div className='pieChartContainer'>
                    {expendData.length > 0 ? <HighchartsReact highcharts={Highcharts} options={expendOptions} /> : <p>数据不够，暂无法生成图表</p>}
                </div>
            </div>
        </>
    )
}