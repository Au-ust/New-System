
import { Table ,Button,Space} from 'antd';
import { Link } from "react-router-dom"
function NewsPublish({dataSource,button}) {
console.log('datasource',dataSource,88888)

    
    
    
    const columns = [
    //在定义表格的列的地方进行样式渲染
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title = "新闻标题", item = {id:1}) => {
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            }
             
        }, {
            title: '作者',
            dataIndex: 'author',
        }, {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return  <div>{category && category.title ? category.title : '无分类'}</div>;
            }
        },{
            title: '操作',
            render: (item) => {
                return <div>
                    <Space>
                        {button?.(item.id)}
                    </Space>
                   
                </div>
            }
        },
    ]
    
    
 
    return (
        <div>
            {/* pageSize设置每页显示的条目数 */}
          <Table columns={columns}  dataSource={dataSource} pagination={{pageSize:5}} rowKey={item=>item.id}></Table>
        </div>
    );
}

export default NewsPublish