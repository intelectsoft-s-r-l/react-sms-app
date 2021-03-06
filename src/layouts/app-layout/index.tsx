import * as React from "react";
import { Layout, Grid, BackTop } from "antd";
import { connect } from "react-redux";
import SideNav from "components/layout-components/SideNav";
import TopNav from "components/layout-components/TopNav";
import MobileNav from "components/layout-components/MobileNav";
import HeaderNav from "components/layout-components/HeaderNav";
import PageHeader from "components/layout-components/PageHeader";
import Footer from "components/layout-components/Footer";
import AppViews from "views/app-views";
import navigationConfig from "configs/NavigationConfig";
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
} from "constants/ThemeConstant";
import Utils from "../../utils";
import { ITheme } from "redux/reducers/Theme";
import { IState } from "redux/reducers";
import { IAuth } from "redux/reducers/Auth";

const { Content } = Layout;
const { useBreakpoint } = Grid;

export const AppLayout = ({ navCollapsed, navType, location }: any) => {
  const currentRouteInfo = Utils.getRouteInfo(
    navigationConfig,
    location.pathname
  );
  const screens = Utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes("lg");
  const isNavSide = navType === NAV_TYPE_SIDE;
  const isNavTop = navType === NAV_TYPE_TOP;
  const getLayoutGutter = () => {
    if (isNavTop || isMobile) {
      return 0;
    }
    return navCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH;
  };
  return (
    <Layout>
      <HeaderNav isMobile={isMobile} />
      {isNavTop && !isMobile ? <TopNav routeInfo={currentRouteInfo} /> : null}
      <Layout className="app-container">
        {isNavSide && !isMobile ? (
          <SideNav routeInfo={currentRouteInfo} />
        ) : null}
        <Layout
          className="app-layout"
          style={{ paddingLeft: getLayoutGutter() }}
        >
          <div className={`app-content ${isNavTop ? "layout-top-nav" : ""}`}>
            <PageHeader
              display={currentRouteInfo?.breadcrumb}
              title={currentRouteInfo?.title}
            />
            <Content>
              <AppViews />
            </Content>
          </div>
          <BackTop />
          <Footer />
        </Layout>
      </Layout>
      {isMobile && <MobileNav />}
    </Layout>
  );
};

const mapStateToProps = ({ theme }: IState) => {
  const { navCollapsed, navType, locale } = theme as ITheme;
  return { navCollapsed, navType, locale };
};

export default connect(mapStateToProps)(React.memo(AppLayout));
