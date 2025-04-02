
import './Login.css'
import ParticlesBackground from './Background';
import LoginForm from './LoginForm';
import Background from './Background'

function Login() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Background
        imageUrl="/croissant.png" 
        blurStrength={15}
        clearSize={300}>
         <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          color: 'white',
          fontSize: '2rem'
        }}>
        <LoginForm />
        </div>
      </Background>
       
      
    </div>
  );
}
export default Login