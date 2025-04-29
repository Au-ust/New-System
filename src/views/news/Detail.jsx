import { Descriptions, Spin, Button, Card, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { LeftOutlined } from '@ant-design/icons';

function Detail() {
  const [newsInfo, setNewsInfo] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/news/${id}?_expand=category&_expand=role`)
      .then((res) => {
        setNewsInfo(res.data);
      });
  }, [id]);

  const auditMap = ['未审核', '审核中', '已通过', '未通过'];
  const colorList = ['default', 'orange', 'green', 'red'];

  const items = newsInfo
    ? [
        {
          key: '1',
          label: '创建者',
          children: newsInfo.author,
        },
        {
          key: '3',
          label: '发布时间',
          children: newsInfo.publishTime
            ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss')
            : '未发布',
        },
        {
          key: '4',
          label: '区域',
          children: newsInfo.region || '全球',
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
          children: 0,
        },
      ]
    : [];

  return (
      <div 
       style={{
        minHeight: '100vh',
        background: '#f0f2f5', // Ant Design 默认灰色背景
        padding: '24px',
    }}>
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      {!newsInfo ? (
        <Spin size="large" />
      ) : (
        <>
          <Card
            title={
              <div>
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>{newsInfo.title}</div>
                <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
                  分类：{newsInfo.category?.title}
                </div>
              </div>
            }
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)', borderRadius: 8 }}
          >
            <Descriptions
              items={items}
              column={2}
              layout="horizontal"
              labelStyle={{ fontWeight: 500 }}
              contentStyle={{ color: '#333' }}
            />
          </Card>

          <Divider orientation="left" style={{ marginTop: 32, fontWeight: 'bold' }}>
            正文内容
          </Divider>

          <Card
            style={{
              background: '#fff',
              boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
              borderRadius: 8,
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newsInfo.content || '') }}
              style={{
                fontSize: 16,
                lineHeight: 1.75,
                color: '#333',
              }}
            />
          </Card>
        </>
      )}
    </div>
  );
}

export default Detail;
