import * as React from "react";
import AppBreadcrumb from "components/layout-components/AppBreadcrumb";
import IntlMessage from "components/util-components/IntlMessage";
export interface IPageHeader {
  title: string;
  display: boolean;
}
export const PageHeader = ({ title, display }: IPageHeader) => {
  return display ? (
    <div className="app-page-header">
      <h3 className="mb-0 mr-3 font-weight-semibold">
        <IntlMessage id={title ? title : ""} />
      </h3>
      <AppBreadcrumb />
    </div>
  ) : null;
};

export default PageHeader;
