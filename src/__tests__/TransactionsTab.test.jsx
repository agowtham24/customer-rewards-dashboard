import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsTab from "../rewardsDashboard/TransactionsTab";

jest.mock("../components/RewardsSection", () => {
  return function MockRewardsSection(props) {
    return (
      <div>
        <div data-testid="section-title">{props.title}</div>
        <div data-testid="rows-length">{props.rows.length}</div>
        <div data-testid="first-row-id">
          {props.rows[0]?.transactionId || "none"}
        </div>
      </div>
    );
  };
});

jest.mock("../rewardsDashboard/PaginationControls", () => {
  return function MockPaginationControls(props) {
    return (
      <div>
        <button onClick={() => props.onPageChange(1)}>1</button>
        <button onClick={() => props.onPageChange(2)}>2</button>

        <span data-testid="current-page">
          Page {props.currentPage} of {props.totalPages}
        </span>
      </div>
    );
  };
});

describe("TransactionsTab", () => {
  const rows = Array.from({ length: 12 }, (_, index) => ({
    transactionId: `TXN-${String(index + 1).padStart(4, "0")}`,
    customerId: `C${String(index + 1).padStart(3, "0")}`,
    customerName: `Customer ${index + 1}`,
    formattedPurchaseDate: "Jun 01, 2026",
    productPurchased: "Keyboard",
    formattedPrice: "$90.00",
    rewardPoints: 10 + index,
  }));

  test("renders section title", () => {
    render(
      <TransactionsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByTestId("section-title")).toHaveTextContent(
      "Transactions",
    );
  });

  test("passes only first page rows to RewardsSection", () => {
    render(
      <TransactionsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByTestId("rows-length")).toHaveTextContent("10");
    expect(screen.getByTestId("first-row-id")).toHaveTextContent("TXN-0001");
  });

  test("shows pagination when rows exceed page size", () => {
    render(
      <TransactionsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent(
      "Page 1 of 2",
    );
  });

  test("moves to next page", () => {
    render(
      <TransactionsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByTestId("current-page")).toHaveTextContent(
      "Page 2 of 2",
    );

    expect(screen.getByTestId("rows-length")).toHaveTextContent("2");

    expect(screen.getByTestId("first-row-id")).toHaveTextContent("TXN-0011");
  });

  test("resets to page 1 when searchValue changes", () => {
    const { rerender } = render(
      <TransactionsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByTestId("first-row-id")).toHaveTextContent("TXN-0011");

    rerender(
      <TransactionsTab
        rows={rows}
        loading={false}
        searchValue="keyboard"
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent(
      "Page 1 of 2",
    );

    expect(screen.getByTestId("first-row-id")).toHaveTextContent("TXN-0001");
  });
});