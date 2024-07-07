import { AuthForm } from "./AuthForm";
import { FC } from "react";

export const AdminPage: FC = () => {
    return (
      <div className={"admin-page"}>
          <h1>Admin Page</h1>
          <p>Welcome to the admin page!</p>
          <AuthForm/>
      </div>
    );
};
