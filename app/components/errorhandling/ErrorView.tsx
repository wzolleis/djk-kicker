import * as React from "react";

export type ErrorViewProps = {
  error: Error
}

const ErrorView = ({ error }: ErrorViewProps) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
};

export default ErrorView;