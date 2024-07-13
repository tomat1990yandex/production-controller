import { FC, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Modal } from 'antd';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const baseUrl = 'http://localhost:5000';

type FieldType = {
  username?: string;
  password?: string;
};

export const AuthForm: FC = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loadings, setLoadings] = useState<boolean>(false);
  const [modal, contextHolder] = Modal.useModal();
  const location = useLocation();

  const textSuccess = {
    title: 'Register success!',
    content: (
      <>
        <span>{`Username: ${username}`}</span>
        <br />
        <span>{`Password: ${password}`}</span>
      </>
    )
  };

  const textError = {
    title: isLogin ? 'Login error!' : 'Register error!'
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
      setLoadings(true);
      const response = await axios.post(`${baseUrl}/api/auth/${isLogin ? 'login' : 'register'}`, {
        username,
        password
      });
      if (isLogin) {
        authContext?.login(response.data.token);
      } else {
        const response = await axios.post(`${baseUrl}/api/auth/login`, {
          username,
          password
        });
        authContext?.login(response.data.token);
      }
      setLoadings(false);
      modal.success(textSuccess);
    } catch (error) {
      console.error('Authentication error', error);
      setLoadings(false);
      modal.error(textError);
    }
  };

  return (
    <Form className="auth-form" layout={'inline'} onFinish={handleAuth}>
      <h2 className="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
      <Form.Item<FieldType>
        name="username"
      >
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </Form.Item>
      <Form.Item<FieldType>
        name="password"
      >
        <Input.Password
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            htmlType={'submit'}
            type={'primary'}
            loading={loadings}>{isLogin ? 'Login' : 'Register'}</Button>
        )}
      </Form.Item>
      {contextHolder}
    </Form>
  );
};
