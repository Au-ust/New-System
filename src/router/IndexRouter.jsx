import { createHashRouter } from 'react-router-dom';
import Login from '../views/login/Login';
import NewSandbox from '../views/sandbox/NewSandBox';
import News from '../views/news/News';
import Detail from '../views/news/Detail';

const router = createHashRouter([
  {
    path: '/login',
    element: <Login />,
  }, {
    path: '/news',
    element: <News />,
  }, {
    path: '/detail/:id',
    element: <Detail />,
  },
  {
    path: '/*',
    element: (
       <NewSandbox />
      // <ProtectedRoute>
       
      // </ProtectedRoute>
    ),
  },
]);

export default router;