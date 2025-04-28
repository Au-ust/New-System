import NewsPublish from "./NewsPublish"
import usePublish from "./usePublish"
import { Button } from 'antd';
function Published() {
    //2标识已发布
    const { dataSource,handleSunset ,notificationContextHolder} = usePublish(2)
    
        return (
            <div>
                {notificationContextHolder}
                <NewsPublish dataSource={dataSource}  button={(id)=><Button color="primary" variant="outlined" onClick={()=>handleSunset(id)}>
                    下线
                </Button>}>
                </NewsPublish>
            </div>
        )
}

export default Published;