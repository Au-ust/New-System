import React,{useState} from 'react';
import { Table } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';


function RightList() {
    const [dataSource, setdataSource] = useState([])
    useEffect(() => { 
       axios.get('http://localhost:3000/rights').then(res => {
           console.log(res.data)
           setdataSource(res.data)
       })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'name',
        }, {
            title: '权限名称',
            dataIndex: 'title',
        }, {
            title: '权限路径',
            dataIndex: 'key',
            key: 'name',
        },
       
        ];
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} />;
        </div>
    );
}

export default RightList;