import { Button } from 'antd';
import NewsPublish from "./NewsPublish"
import usePublish from "./usePublish"
function Unpublished() {
    //1准备发布的
    const { dataSource,handlePublish, notificationContextHolder} = usePublish(1)
    return (
        <div>
            {notificationContextHolder}
            <NewsPublish dataSource={dataSource} button={(id)=><Button color="primary" variant="solid" onClick={()=>handlePublish(id)}>
                    发布
                </Button>}>

            </NewsPublish>
        </div>
    );
}

export default Unpublished;