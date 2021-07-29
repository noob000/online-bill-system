import { useEffect, useState } from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import { YearSortedData } from '../index.d';

interface YearlyChartProps {
    data: YearSortedData[];
    yearlist: number[]
}

export default function YearlyChart(props: YearlyChartProps) {
    const [chartOptions, setChartOptions] = useState<any>({});
    useEffect(() => {
        if (props.data) {
            const data = props.data, dataYearSorted = [], incomeData = [], expendData = [];
            for (let element of data) {
                let tempdata = element.data;
                let tempObject = {
                    year: element.year,
                    income: 0,
                    expend: 0
                }
                for (let ele of tempdata) {
                    if (ele.cata === 'income') tempObject.income += ele.amount;
                    else tempObject.expend += ele.amount
                }
                dataYearSorted.push(tempObject);
            }
            for (let element of dataYearSorted) {
                incomeData.push(element.income);
                expendData.push(element.expend)
            }
            const chartOptions: any = {
                chart: {
                    type: 'line'
                },
                title: {
                    text: '历史年度收入支出趋势图'
                },
                tooltip: {
                    valueSuffix: '元',
                    crosshairs: true,
                    shared: true
                },
                xAxis: {
                    categories: props.yearlist
                },
                yAxis: {
                    title: {
                        text: '金额/元'
                    }
                },
                series: [
                    {
                        name: '支出',
                        data: expendData
                    },
                    {
                        name: '收入',
                        data: incomeData
                    }],
                dataLabels: {
                    softConnecter: false,
                    distance: 20,
                    connectorPadding: 20,
                    formatter: function (this: any) {
                        return `${this.point.name}:${this.y}元`
                    }
                }

            }
            setChartOptions(chartOptions);
        }
    }, [props])
    return (
        <div>
            {props.data.length>0?<HighchartsReact highcharts={Highcharts} options={chartOptions} />:<p>数据不够，暂无法生成图表</p>}
        </div>
    )
}