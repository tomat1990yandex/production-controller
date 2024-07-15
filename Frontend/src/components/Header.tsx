import { FC } from 'react';
import { Button } from 'antd';
import { AuthForm } from './AuthForm.tsx';

const VITE_APP_NAME = import.meta.env.VITE_APP_NAME;

interface HeaderProps {
  handleAddGroup: () => void;
  isAuthenticated: boolean;
  logout: VoidFunction | undefined;
}

export const Header: FC<HeaderProps> = ({ handleAddGroup, isAuthenticated, logout }) => {
  return (
    <header className="header-container">
      <h1 className="header-title">{VITE_APP_NAME}</h1>
      <div className="auth-wrapper">
        {!isAuthenticated ? (
          <AuthForm />
        ) : (
          <>
            <Button onClick={handleAddGroup}>Добавить группу</Button>
            <Button type="primary" onClick={logout}>
              Выйти
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
