import { useEffect, useState } from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';

export default function MonthlyChart(props: any) {
    const [incomeMonthData, setIncomeMonthData] = useState<any>([]);
    const [expendMonthData, setExpendMonthData] = useState<any>([]);
    const [incomeData, setIncomeData] = useState<any>([]);
    const [expendData, setExpendData] = useState<any>([]);
    const [chartOptions, setChartOptions] = useState<any>({});

    useEffect(() => {
        const { data, year } = props;
        const tempData = data.filter((element: any) => element.year === year)[0].data;
        let incomelist = [], expendlist = [];
        for (let element of tempData) {
            if (element.cata === 'income') incomelist.push(element);
            else if (element.cata === 'expend') expendlist.push(element);
        }
        setIncomeData(incomelist);
        setExpendData(expendlist);
    }, [props])
    useEffect(() => {
        if (incomeData.length > 0) {
            let dataMonthSorted: any = [{
                month: 0,
                amount: 0
            }, {
                month: 1,
                amount: 0
            }, {
                month: 2,
                amount: 0
            }, {
                month: 3,
                amount: 0
            }, {
                month: 4,
                amount: 0
            }, {
                month: 5,
                amount: 0
            }, {
                month: 6,
                amount: 0
            }, {
                month: 7,
                amount: 0
            }, {
                month: 8,
                amount: 0
            }, {
                month: 9,
                amount: 0
            }, {
                month: 10,
                amount: 0
            }, {
                month: 11,
                amount: 0
            }], tempData = [];
            for (let element of incomeData) {
                let month = new Date(element.date).getMonth();
                dataMonthSorted[month] = {
                    month: month,
                    amount: dataMonthSorted[month].amount + element.amount
                }
            }
            for (let element of dataMonthSorted) tempData.push(element.amount);
            setIncomeMonthData(tempData);
        }

    }, [incomeData])
    useEffect(() => {
        if (expendData.length > 0) {
            let dataMonthSorted: any = [{
                month: 0,
                amount: 0
            }, {
                month: 1,
                amount: 0
            }, {
                month: 2,
                amount: 0
            }, {
                month: 3,
                amount: 0
            }, {
                month: 4,
                amount: 0
            }, {
                month: 5,
                amount: 0
            }, {
                month: 6,
                amount: 0
            }, {
                month: 7,
                amount: 0
            }, {
                month: 8,
                amount: 0
            }, {
                month: 9,
                amount: 0
            }, {
                month: 10,
                amount: 0
            }, {
                month: 11,
                amount: 0
            }], tempData = [];
            for (let element of expendData) {
                let month = new Date(element.date).getMonth();
                dataMonthSorted[month] = {
                    month: month,
                    amount: dataMonthSorted[month].amount + element.amount
                }
            }
            for (let element of dataMonthSorted) tempData.push(element.amount);
            setExpendMonthData(tempData);
        }
    }, [expendData])
    useEffect(() => {
        const { year } = props;
        const chartOptions: any = {
            chart: {
                type: 'line'
            },
            title: {
                text: `${year}年度收入支出趋势图`
            },
            tooltip: {
                valueSuffix: '元',
                crosshairs: true,
                shared: true
            },
            xAxis: {
                categories: ['一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: {
                title: {
                    text: '金额/元'
                }
            },
            series: [
                {
                    name: '支出',
                    data: expendMonthData
                },
                {
                    name: '收入',
                    data: incomeMonthData
                }],
            dataLabels: {
                softConnecter: false,
                distance: 20,
                connectorPadding: 20,
                formatter: function (this: any) {
                    return `${this.point.name}:${this.y} 元`
                }
            }
        }

        setChartOptions(chartOptions)//eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incomeMonthData, expendMonthData])

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    )
}