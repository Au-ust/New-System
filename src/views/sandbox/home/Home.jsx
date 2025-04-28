import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import avatarImg from '../../../Avatar.jpg'
import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as Echarts from 'echarts'//表示把echarts的东西都引入进来
import _ from 'lodash'//引入lodash库

const { Meta } = Card

function Home() {
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token') || '{}')
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [allList, setAllList] = useState([])
    const [open, setOpen] = useState(false)

    const barRef = useRef()
    const pieRef = useRef()
    const myChart = useRef(null)//使用全局
    const myChart2 = useRef(null)//使用全局

    useEffect(() => { 
        axios.get('http://localhost:3000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => { 
            // 处理数据，设置到状态中
            setViewList(res.data)
        })
    }, [])

    useEffect(() => { 
        axios.get('http://localhost:3000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => { 
            // 处理数据，设置到状态中
            setStarList(res.data)
        })
    }, [])//挂载空数组避免重复请求
  
    useEffect(() => {
        axios.get('http://localhost:3000/news?publishState=2&_expand=category').then(res => { 
            renderBarView(_.groupBy(res.data, item => item.category?.title || '未分类'))
            setAllList(res.data.filter(item => item.author === username))
        })

        return () => {
            window.removeEventListener('resize', handleResize)
            if (myChart.current) {
                myChart.current.dispose()
            }
        }
    }, [])

    const handleResize = () => {
        if (myChart.current) {
            myChart.current.resize()
        }
        if (myChart2.current) {
            myChart2.current.resize()
        }
    }

    const renderPieView = (groupObj) => { 
        if (!pieRef.current) return
        if (myChart2.current) {
            myChart2.current.dispose() // 如果之前已经有实例，先销毁
        }
        //数据处理工作
        var list = []
        for (const i in groupObj) { 
            list.push({
                value: groupObj[i].length,
                name: i
            })
        }
        console.log('list:', list)
        myChart2.current = Echarts.init(pieRef.current)//初始化图表
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '当前用户发布的新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        myChart2.current.setOption(option) // 应该使用ref的current属性
        window.addEventListener('resize', handleResize)
    }

    const renderBarView = (groupObj) => {
        if (!barRef.current) return

        if (myChart.current) {
            myChart.current.dispose() // 如果之前已经有实例，先销毁
        }
       
        myChart.current = Echarts.init(barRef.current)//初始化图表
        // 指定图表的配置项和数据
        var xList = Object.keys(groupObj) // ['国际新闻', '财经新闻', '体育新闻']
        var yList = Object.values(groupObj).map(item => item.length)
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: xList,
                axisLabel: {
                    rotate: '45',
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1//保证最小间隔度
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: yList,
                    itemStyle: {
                        borderRadius: [5, 5, 0, 0], // 柱子的圆角
                        color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#646eff' }, // 渐变开始色
                            { offset: 1, color: '#2980b9' } // 渐变结束色
                        ])
                    }
                }
            ]
        }

        myChart.current.setOption(option) // 应该使用ref的current属性
        // 监听窗口resize事件，自动调整图表大小
        window.addEventListener('resize', handleResize)
    }
     
    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title='用户最常浏览' variant='outlined'>
                        <List
                            size='small'
                            dataSource={viewList}
                            renderItem={item => (
                                <List.Item>
                                    <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title='用户点赞最多' variant='outlined'>
                        <List
                            size='small'
                            dataSource={starList}
                            renderItem={item => (
                                <List.Item>
                                    <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        style={{ width: 300 }}
                        cover={
                            <img
                                alt='example'
                                src='/croissant.png'
                            />
                        }
                        actions={[
                            <SettingOutlined key='setting' onClick={() => { 
                                setOpen(true)
                            }} />, //点击设置按钮
                            <EditOutlined key='edit' />,
                            <EllipsisOutlined key='ellipsis' />
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src={avatarImg} />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : '全球'}</b>
                                    <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer 
                width='500px' 
                title='个人新闻分类' 
                onClose={() => setOpen(false)} 
                open={open}
                //在抽屉打开或关闭动画完成之后触发，参数 open 表示当前 Drawer 是否处于打开状态。
                afterOpenChange={(isOpen) => {
                    if (isOpen) {
                        renderPieView(_.groupBy(allList, item => item.category?.title || '未分类'))
                    }
                }}
            >
                <div ref={pieRef} style={{ height: '400px', marginTop: '30px' }}></div>
            </Drawer>

            <div id='main' ref={barRef} style={{ height: '400px', marginTop: '30px' }}></div>
        </div>
    )
}

export default Home
