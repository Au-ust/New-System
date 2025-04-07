
import { Button } from "antd";
import axios from "axios";
function Home() {

    const ajax = () => {
        //取数据
        // axios.get('/posts').then(res => {
        //     console.log(res.data)
        // })
        //增数据
        // axios.post('/posts', {
        //     title: '标题',
        //     author: '作者'
        // })
        // axios.put('/posts/1', {
        //     title: '标题111',
        //     author: '作者111'
        // })
        //更新数据
        // axios.patch('/posts/1', {
        //     title: '标题22222',
        // })
        //删除 delete
        // axios.delete('/posts/1')

        //_embed
        // axios.get('/posts?_embed=comments').then(res => {
        //     console.log(res.data)
        // })
        //_expand
        // axios.get('/comments?_expand=post').then(res => {
        //     console.log(res.data)
        // })

    }

    return (
        <div>
            <Button type="primary" onClick={ajax}>Primary Button</Button>
        </div>
    );
}

export default Home;