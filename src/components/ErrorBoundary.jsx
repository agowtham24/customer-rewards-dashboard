import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);

    // Future integration point for external logging service
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <div className="min-h-screen bg-slate-50 p-6">
          <Card className="mx-auto max-w-2xl border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">
                Something went wrong
              </CardTitle>
              <CardDescription>
                {error?.message || "An unexpected error occurred."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Please refresh the page and try again.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
