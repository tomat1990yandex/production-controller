import { FC, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input, Modal } from 'antd';
import { AuthContext } from "../contexts/AuthContext";
import { useLocation } from 'react-router-dom';

const baseUrl = 'http://localhost:5000';

export const AuthForm: FC = () => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loadings, setLoadings] = useState<boolean>(false);
    const [modal, contextHolder] = Modal.useModal();
    const location = useLocation();

    const config = {
        title: isLogin ? 'Register success!' : 'Register error!',
        content: (
          <>
              <span>{`Username: ${username}`}</span>
              <br/>
              <span>{`Password: ${password}`}</span>
          </>
        ),
    };

    useEffect(() => {
        if (location.pathname === '/admin') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const handleAuth = async () => {
        try {
            setLoadings(true)
            const response = await axios.post(`${baseUrl}/api/auth/${isLogin ? 'login' : 'register'}`, {
                username,
                password,
            });
            authContext?.login(response.data.token);
            setLoadings(false)
            modal.success(config)
        } catch (error) {
            console.error('Authentication error', error);
            setLoadings(false)
            modal.error(config)
        }
    };

    return (
      <div className="auth-form">
          <h2 className={"auth-title"}>{isLogin ? 'Login' : 'Register'}</h2>
          <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button type={"primary"} onClick={handleAuth} loading={loadings}>{isLogin ? 'Login' : 'Register'}</Button>
          {contextHolder}
      </div>
    );
};
