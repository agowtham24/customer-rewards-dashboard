import { render, screen } from "@testing-library/react";
import RewardsDashboard from "../rewardsDashboard";
import { useTransactions } from "../hooks/useTransactions";

jest.mock("../hooks/useTransactions", () => ({
  useTransactions: jest.fn(),
}));

jest.mock("../rewardsDashboard/MonthlyRewardsTab", () => {
  return function MockMonthlyRewardsTab(props) {
    return <div data-testid="monthly-tab">Monthly:{props.rows.length}</div>;
  };
});

jest.mock("../rewardsDashboard/TotalRewardsTab", () => {
  return function MockTotalRewardsTab(props) {
    return <div data-testid="total-tab">Total:{props.rows.length}</div>;
  };
});

jest.mock("../rewardsDashboard/TransactionsTab", () => {
  return function MockTransactionsTab(props) {
    return (
      <div data-testid="transactions-tab">
        Transactions:{props.rows.length}
      </div>
    );
  };
});

describe("RewardsDashboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    useTransactions.mockReturnValue({
      transactions: [],
      loading: true,
      error: null,
      reload: jest.fn(),
    });

    render(<RewardsDashboard />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    useTransactions.mockReturnValue({
      transactions: [],
      loading: false,
      error: new Error("Failed to load"),
      reload: jest.fn(),
    });

    render(<RewardsDashboard />);

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
  });

  test("renders empty state", () => {
    useTransactions.mockReturnValue({
      transactions: [],
      loading: false,
      error: null,
      reload: jest.fn(),
    });

    render(<RewardsDashboard />);

    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  test("renders transactions tab by default when transactions are available", () => {
    useTransactions.mockReturnValue({
      transactions: [
        {
          transactionId: "TXN-0001",
          customerId: "C001",
          firstName: "Aarav",
          lastName: "Sharma",
          purchaseDate: "2026-05-01",
          productPurchased: "Keyboard",
          price: 90,
        },
        {
          transactionId: "TXN-0002",
          customerId: "C002",
          firstName: "Priya",
          lastName: "Verma",
          purchaseDate: "2026-06-10",
          productPurchased: "Mouse",
          price: 120,
        },
      ],
      loading: false,
      error: null,
      reload: jest.fn(),
    });

    render(<RewardsDashboard />);

    expect(
      screen.getByText(/Customer Rewards Dashboard/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("tab", { name: /Transactions/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("tab", { name: /Monthly Rewards/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("tab", { name: /Total Rewards/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("transactions-tab")).toHaveTextContent(
      "Transactions:",
    );

    expect(screen.queryByTestId("monthly-tab")).not.toBeInTheDocument();

    expect(screen.queryByTestId("total-tab")).not.toBeInTheDocument();
  });
});