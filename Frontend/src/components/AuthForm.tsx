import { FC, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Modal } from 'antd';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../constants/constants';

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
    title: 'Успешная регистрация!',
    content: (
      <>
        <span>{`Username: ${username}`}</span>
        <br />
        <span>{`Password: ${password}`}</span>
      </>
    )
  };

  const textError = {
    title: isLogin ? 'Ошибка входа!' : 'Ошибка регистрации!'
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
      const response = await axios.post(`${BASE_URL}/api/auth/${isLogin ? 'login' : 'register'}`, {
        username,
        password
      });
      if (isLogin) {
        authContext?.login(response.data.token);
      } else {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
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
      <h2 className="auth-title">{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <Form.Item<FieldType>
        name="username"
      >
        <Input
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Item>
      <Form.Item<FieldType>
        name="password"
      >
        <Input.Password
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            htmlType={'submit'}
            type={'primary'}
            loading={loadings}>{isLogin ? 'Вход' : 'Регистрация'}</Button>
        )}
      </Form.Item>
      {contextHolder}
    </Form>
  );
};
