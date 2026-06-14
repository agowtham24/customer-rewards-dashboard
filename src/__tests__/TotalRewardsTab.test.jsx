import { render, screen, fireEvent } from "@testing-library/react";
import TotalRewardsTab from "../rewardsDashboard/TotalRewardsTab";

jest.mock("../components/RewardsSection", () => {
  return function MockRewardsSection(props) {
    return (
      <div>
        <div data-testid="section-title">{props.title}</div>
        <div data-testid="rows-length">{props.rows.length}</div>
        <div data-testid="first-row-id">
          {props.rows[0]?.customerId || "none"}
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

describe("TotalRewardsTab", () => {
  const rows = Array.from({ length: 12 }, (_, index) => ({
    customerId: `C${String(index + 1).padStart(3, "0")}`,
    name: `Customer ${index + 1}`,
    rewardPoints: 10 + index,
  }));

  test("renders section title", () => {
    render(
      <TotalRewardsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByTestId("section-title")).toHaveTextContent(
      "Total Rewards",
    );
  });

  test("passes only first page rows to RewardsSection", () => {
    render(
      <TotalRewardsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByTestId("rows-length")).toHaveTextContent("10");
    expect(screen.getByTestId("first-row-id")).toHaveTextContent("C001");
  });

  test("shows pagination when rows exceed page size", () => {
    render(
      <TotalRewardsTab
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
      <TotalRewardsTab
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

    expect(screen.getByTestId("first-row-id")).toHaveTextContent("C011");
  });

  test("resets to page 1 when searchValue changes", () => {
    const { rerender } = render(
      <TotalRewardsTab
        rows={rows}
        loading={false}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByTestId("first-row-id")).toHaveTextContent("C011");

    rerender(
      <TotalRewardsTab
        rows={rows}
        loading={false}
        searchValue="john"
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent(
      "Page 1 of 2",
    );

    expect(screen.getByTestId("first-row-id")).toHaveTextContent("C001");
  });
});