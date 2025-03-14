import React from "react";

import { Layout, Menu, theme } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch } from "../../redux/hook";
import { logout } from "../../redux/features/auth/authSlice";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: "create-book",
    label: <NavLink to={"/create-book"}>Create Book</NavLink>,
  },
  {
    key: "book-list",
    label: <NavLink to={"/book-list"}>Book List</NavLink>,
  },
  {
    key: "sale-history",
    label: <NavLink to={"/sale-history"}>Sale History</NavLink>,
  },
];

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            color: "white",
            height: "4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 className="text-xl font-semibold">Book Management</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }}>
          <button
            className="text-white hover:cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
