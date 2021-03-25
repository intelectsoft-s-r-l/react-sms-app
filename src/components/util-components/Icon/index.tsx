import * as React from "react";
import { Component } from "react";

type IconProps = {
  type?: any;
  className?: string;
};

export class Icon extends Component<IconProps> {
  render() {
    const { type, className } = this.props;
    return <>{React.createElement(type, { className: className })}</>;
  }
}

export default Icon;
