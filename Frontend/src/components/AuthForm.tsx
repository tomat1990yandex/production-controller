import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Button, Input } from 'antd';
import { AuthContext } from "../contexts/AuthContext";

const baseUrl = 'http://localhost:5000';

export const AuthForm: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/auth/${isLogin ? 'login' : 'register'}`, {
                username,
                password,
            });
            authContext?.login(response.data.token);
        } catch (error) {
            console.error('Authentication error', error);
        }
    };

    return (
      <div className="auth-form">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleAuth}>{isLogin ? 'Login' : 'Register'}</Button>
          <Button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </Button>
      </div>
    );
};
