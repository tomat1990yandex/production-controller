import { FC } from 'react';
import { Button } from 'antd';
import { AuthForm } from "./AuthForm.tsx";

interface HeaderProps {
    handleAddGroup: () => void;
    isAuthenticated: boolean;
    logout: VoidFunction | undefined;
}

export const Header: FC<HeaderProps> = ({ handleAddGroup, isAuthenticated, logout }) => {
    return (
      <header className="header-container">
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
      </header>
    );
};
