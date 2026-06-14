import ErrorBoundary from "./components/ErrorBoundary";
import RewardsDashboard from "./rewardsDashboard";

function App() {
  return (
    <ErrorBoundary>
      <RewardsDashboard />
    </ErrorBoundary>
  );
}

export default App;