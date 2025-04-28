import axios from "axios";
import { useEffect, useState } from "react"
import {notification} from 'antd'
import { useNavigate } from "react-router-dom"  
function UsePublish(type) {
           const navigate = useNavigate()//使用useNavigate钩子
           const [api, notificationContextHolder] = notification.useNotification()
           const token = JSON.parse(localStorage.getItem("token")) || {}
           const username = token.username || ""// 直接访问 token.username
           const [dataSource, setDataSource] = useState([])
    useEffect(() => {
               console.log('type:',type)
               console.log('username:',username)
               
               axios(`http://localhost:3000/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
                   console.log(res)
                   setDataSource(res.data)
               }
                   
           ) 
           }, [username, type])
    const handlePublish = (id) => {
        console.log(id)
         axios.patch(`http://localhost:3000/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            console.log('发布成功:', res.data)
            setDataSource(dataSource.filter(item => item.id !== id))
            api.success({
                message: '通知',
                description: `已发布新闻：
                《${res.data.title}》，您可以到【发布管理/已发布】中查看你的新闻`,
                placement: 'bottomRight',
            })
            setTimeout(() => {
            navigate(`/publish-manage/published`);
            }, 1500)
        })
    }
    const handleSunset = (id) => {
        console.log(id)
         axios.patch(`http://localhost:3000/news/${id}`, {
            publishState: 3,
        }).then(res => {
            console.log('下线成功:', res.data)
            setDataSource(dataSource.filter(item => item.id !== id))
            api.success({
                message: '通知',
                description: `已下线新闻：
                《${res.data.title}》，您可以到【发布管理/已下线】中查看你的新闻`,
                placement: 'bottomRight',
            })
            setTimeout(() => {
            navigate(`/publish-manage/published`);
            }, 1500)
        })
        
    }
    const handleDelete = (id) => {
        console.log(id)
         axios.delete(`http://localhost:3000/news/${id}`).then(res => {
            console.log('删除成功:', res.data)
            setDataSource(dataSource.filter(item => item.id !== id))
            api.success({
                message: '通知',
                description: `已删除新闻：
                《${res.data.title}》`,
                placement: 'bottomRight',
            })
            setTimeout(() => {
            navigate(`/publish-manage/published`);
            }, 1500)
        })
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete,
        notificationContextHolder
    }

}

export default UsePublish;