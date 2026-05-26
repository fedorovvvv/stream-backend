import { Alert, Button, Stack } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Component, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: unknown) {
    // TODO(observability): wire Sentry / console exporter when DSN is provisioned.
    console.error('[ErrorBoundary]', error);
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <Stack p="md">
          <Alert color="red" icon={<IconAlertTriangle />} title="Something broke">
            {this.state.error.message}
          </Alert>
          <Button variant="light" onClick={this.reset}>
            Try again
          </Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}
