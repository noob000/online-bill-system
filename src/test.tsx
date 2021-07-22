import 'antd/dist/antd.css';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
const color: any = Highcharts.getOptions().colors;
export default function Test(props: any) {
    const data1 = [{
        "date": "2021-7-14",
        "catagory": "Financing",
        "cata": "income",
        "amount": 132132,
        "note": "132123",
        "dateObject": "2021-07-14T01:44:55.086Z"
    }, {
        "date": "2021-7-3",
        "catagory": "others",
        "cata": "income",
        "amount": 123123123,
        "note": "123131",
        "dateObject": "2021-07-03T01:45:05.592Z"
    }, {
        "date": "2022-7-16",
        "catagory": "transfer",
        "cata": "income",
        "amount": 1231313,
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
    const chartOptions: any = {
        chart: {
            type: 'line'
        },
        title: {
            text: 'title'
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
                data: [123, 456, 89.5, 45464, 1322, 78978, 13231, 46546, 4568, 78985, 6254, 356]
            },
            {
                name: '收入',
                data: [1234, 4565, 89.58, 4546, 13211, 7898, 1331, 4656, 458, 7885, 6254, 356]
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

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    )
}