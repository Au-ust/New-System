// New.jsx
import { useEffect, useState } from "react";
import { Table, Tag, Pagination, Select, Input, Typography } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const { Option } = Select;
const { Paragraph } = Typography;

function highlight(text, keyword) {
  if (!keyword) return text;
  const reg = new RegExp(`(${keyword})`, "gi");
  return <span dangerouslySetInnerHTML={{ __html: text.replace(reg, '<span style="background: yellow">$1</span>') }} />;
}

function New() {
  const [viewList, setViewList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3000/news?publishState=2&_expand=category').then(res => {
      setViewList(res.data);
      setFilteredList(res.data);
    });
    axios.get('http://localhost:3000/categories').then(res => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    let filtered = [...viewList];
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }
    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword)
      );
    }
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchText, selectedCategory, viewList]);

  const columns = [
 {
  title: "标题",
  dataIndex: "title",
  render: (text, record) => (
    <Link to={`/detail/${record.id}`}>{highlight(text, searchText)}</Link>
  ),
},
{
  title: "内容",
  dataIndex: "content",
  render: (text) => {
    const keyword = searchText.trim();
    const highlighted = keyword
      ? text.replace(new RegExp(`(${keyword})`, "gi"), `<span style="background:yellow">$1</span>`)
      : text;
    return (
      <Paragraph ellipsis={{ rows: 2, expandable: false }}>
        <div
          dangerouslySetInnerHTML={{ __html: highlighted }}
          style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
        />
      </Paragraph>
    );
  },
}
,
    {
      title: "分类",
      dataIndex: ["category", "title"],
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ];

  return (
    <div  style={{
        minHeight: '100vh',
        background: '#f0f2f5', // Ant Design 默认灰色背景
        padding: '24px',
    }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          value={selectedCategory}
          onChange={value => setSelectedCategory(value)}
          style={{ width: 200 }}
        >
          <Option value="all">全部分类</Option>
          {categories.map(cat => (
            <Option key={cat.id} value={cat.id}>{cat.title}</Option>
          ))}
        </Select>
        <Input.Search
          placeholder="搜索标题或内容"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
      </div>
      <Table
        dataSource={filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredList.length}
        onChange={page => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: "right" }}
      />
    </div>
  );
}

export default New;
