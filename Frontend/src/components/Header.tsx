import { FC } from 'react';
import { Button } from 'antd';
import { AuthForm } from './AuthForm.tsx';

interface HeaderProps {
  handleAddGroup: () => void;
  isAuthenticated: boolean;
  logout: VoidFunction | undefined;
}

export const Header: FC<HeaderProps> = ({ handleAddGroup, isAuthenticated, logout }) => {
  return (
    <header className="header-container">
      <h2 className="header-title">Production-controller</h2>
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
