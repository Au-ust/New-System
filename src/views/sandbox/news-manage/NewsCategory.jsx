import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Button, Modal, Space, Form, Input } from 'antd';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import { log } from 'three/tsl';

function NewsCategory() {
  const [dataSource, setdataSource] = useState([]);
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    axios.get('http://localhost:3000/categories').then(res => {
      setdataSource(res.data);
    });
  }, []);

  const deleteMethod = (item) => {
    const list = dataSource.filter(data => data.id !== item.id);
    setdataSource(list);
    axios.delete(`http://localhost:3000/categories/${item.id}`);
  };

  const createConfig = (item) => ({
    title: '您确定要删除该条目？',
    content: `即将删除：${item.title}`,
    onOk() {
      deleteMethod(item);
    },
    onCancel() {
      console.log('取消删除！');
    }
  });

  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: `${title} is required.` }]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" style={{ paddingInlineEnd: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      )
    }
    return <td {...restProps}>{childNode}</td>
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    }
    }
    const handleSave = (record) => {
        setdataSource(dataSource.map(item => (item.id === record.id ? { id: item.id, title: record.title, value: record.title } : item)))
        axios.patch(`http://localhost:3000/categories/${record.id}`, {
            title: record.title,
        })
    }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (key) => <b>{key}</b>,
    },
    {
      title: '栏目名称',
        dataIndex: 'title',
        onCell: (record) =>({
            record,
            editable: true,
            dataIndex: 'title',
            title: '栏目名称',
            handleSave: handleSave
      })
    },
    {
      title: '操作',
      render: (item) => (
        <Space>
          <Button
            danger
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => modal.confirm(createConfig(item))}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={item => item.id}
        components={components}
      />
    </div>
  );
}

export default NewsCategory;
