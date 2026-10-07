import { Component } from "react";

// Guards each 3D canvas so a WebGL / asset-loading failure (unsupported
// browser, blocked CDN, no GPU) degrades to the CSS fallback instead of
// taking down the whole page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("3D visual failed, falling back:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
