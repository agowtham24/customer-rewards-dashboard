import ErrorBoundary from "./components/ErrorBoundary";
import { Button } from "@/components/ui/button";
function App() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </ErrorBoundary>
  );
}

export default App;
