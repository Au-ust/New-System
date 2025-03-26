
import { Button } from "antd";
import axios from "axios";
function Home() {

    const ajax = () => {
        //取数据
        // axios.get('http://localhost:3000/posts').then(res => {
        //     console.log(res.data)
        // })
        //增数据
        // axios.post('http://localhost:3000/posts', {
        //     title: '标题',
        //     author: '作者'
        // })
        // axios.put('http://localhost:3000/posts/1', {
        //     title: '标题111',
        //     author: '作者111'
        // })
        //更新数据
        // axios.patch('http://localhost:3000/posts/1', {
        //     title: '标题22222',
        // })
        //删除 delete
        // axios.delete('http://localhost:3000/posts/1')

        //_embed
        // axios.get('http://localhost:3000/posts?_embed=comments').then(res => {
        //     console.log(res.data)
        // })
        //_expand
        // axios.get('http://localhost:3000/comments?_expand=post').then(res => {
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