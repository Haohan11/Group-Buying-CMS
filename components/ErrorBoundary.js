import React from "react";
import Logo from "@/components/logo";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  async componentDidCatch(error, errorInfo) {
    // const formData = new FormData();
    // formData.append("logError", JSON.stringify({ error, errorInfo }));

    await fetch("/api/errorLogger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logError: `${error.message}\n${errorInfo.componentStack}`,
      }),
    });
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="h-100 flex-center flex-column">
          <Logo width="300" />
          <p className="fs-2 fw-bold text-primary mt-12">系統發生錯誤</p>
          <button
            type="button"
            className="btn btn-primary mt-8"
            onClick={() => this.setState({ hasError: false })}
          >
            重試
          </button>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
