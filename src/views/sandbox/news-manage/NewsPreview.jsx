import {Descriptions, Spin} from 'antd';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import DOMPurify from 'dompurify';
function NewsPreview() {
    const [newsInfo, setNewsInfo] = React.useState(null);
    const { id } = useParams(); // 直接解构出id
    useEffect(() => {
        axios.get(`http://localhost:3000/news/${id}?_expand=category&_expand=role`).then(res => {  
        console.log('获取新闻信息:', res.data);
    setNewsInfo(res.data);
    })
       
    }, [id]);
    //定义映射队列
    const auditMap = {
        0: '未审核',
        1: '审核中',
        2: '已通过',
        3: '未通过'
    };
    const publishMap = {
        0: '未发布',
        1: '待发布',
        2: '已上线',
        3: '未下线'
    }
//动态生成item
const items = newsInfo ? [
  {
    key: '1',
    label: '创建者',
    children: newsInfo.author,
  },
  {
    key: '2',
    label: '创建时间',
    children: moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss'),  
  },
  {
    key: '3',
    label: '发布时间',
    children: newsInfo.publishTime,
  },
  {
    key: '4',
    label: '区域',
    children: newsInfo.region,
  },
  {
    key: '5',
    label: '审核状态',
    children: (
    <span style={{ 
        color: newsInfo.auditState === 0 ? 'red' : 
            newsInfo.auditState === 1 ? 'orange' : 'green'
    }}>
      {auditMap[newsInfo.auditState]}
    </span>
  )
},
  {
    key: '6',
    label: '发布状态',
      children: (
    <span style={{
        color: newsInfo.publishState === 0 ? 'red' : 
            newsInfo.publishState === 1 ? 'orange' : 'green'
    }}>
      {publishMap[newsInfo.publishState]}   
    </span>
  )
  },
  {
    key: '7',
    label: '访问数量',
    children: newsInfo.view,
  },
  {
    key: '8',
    label: '点赞数量',
    children: newsInfo.star,
  },
  {
    key: '9',
    label: '评论数量',
    children: 0, // 如果有评论字段你可以填上
  },
] : [];
    return (
         <div>
            {!newsInfo ? (
                <Spin />
            ) : (
                <>
                    <Descriptions
                        title={
                            <div>
                                <div style={{ fontSize: 20 }}>{newsInfo.title}</div>
                                {newsInfo.category?.title && (
                                    <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                                        {newsInfo.category.title}
                                    </div>
                                )}
                            </div>
                        }
                        items={items}
                    />
                    <div
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newsInfo.content || '') }}
                        style={{
                            marginTop: '20px',
                            fontSize: '16px',
                            lineHeight: '1.5',
                            border: '1px solid black',
                            padding: '10px'
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default NewsPreview;