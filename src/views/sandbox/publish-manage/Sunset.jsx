
import NewsPublish from "./NewsPublish"
import usePublish from "./usePublish"
import { Button ,Modal} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
function Sunset() {
    //3已下线的
    const { dataSource ,handleDelete,notificationContextHolder} = usePublish(3)
    return (
        <div>
            {notificationContextHolder}
            <NewsPublish dataSource={dataSource}
                button={(id) => <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => {
                Modal.confirm({
                    title: '确认删除',
                    content: '确定要删除这条新闻吗？',
                    onOk: () => handleDelete(id)
                });
                }}>
                    {/* {把按钮当作函数传入，函数内传参确认是哪个新闻,也可以有更好的写法} */}
                </Button>}>
                

            </NewsPublish>
        </div>
    );
}

export default Sunset