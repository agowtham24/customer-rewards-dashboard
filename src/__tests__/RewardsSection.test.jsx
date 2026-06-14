import { render, screen, fireEvent } from "@testing-library/react";
import RewardsSection from "../components/RewardsSection";

const columns = [
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Points",
    accessor: "rewardPoints",
  },
];

const rows = [
  {
    id: 1,
    name: "John Doe",
    rewardPoints: 90,
  },
];

describe("RewardsSection", () => {
  test("renders title and description", () => {
    render(
      <RewardsSection
        title="Monthly Rewards"
        description="Reward summary"
        columns={columns}
        rows={rows}
        loading={false}
        getRowKey={(row) => row.id}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByText("Monthly Rewards")).toBeInTheDocument();
    expect(screen.getByText("Reward summary")).toBeInTheDocument();
  });

  test("renders table headers", () => {
    render(
      <RewardsSection
        title="Monthly Rewards"
        description="Reward summary"
        columns={columns}
        rows={rows}
        loading={false}
        getRowKey={(row) => row.id}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Points")).toBeInTheDocument();
  });

  test("renders rows", () => {
    render(
      <RewardsSection
        title="Monthly Rewards"
        description="Reward summary"
        columns={columns}
        rows={rows}
        loading={false}
        getRowKey={(row) => row.id}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
  });

  test("shows empty state", () => {
    render(
      <RewardsSection
        title="Monthly Rewards"
        description="Reward summary"
        columns={columns}
        rows={[]}
        loading={false}
        getRowKey={(row) => row.id}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByText("No records found.")).toBeInTheDocument();
  });

  test("renders search input", () => {
    render(
      <RewardsSection
        title="Monthly Rewards"
        description="Reward summary"
        columns={columns}
        rows={rows}
        loading={false}
        getRowKey={(row) => row.id}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  test("calls onSearchChange", () => {
    const handleSearch = jest.fn();

    render(
      <RewardsSection
        title="Monthly Rewards"
        description="Reward summary"
        columns={columns}
        rows={rows}
        loading={false}
        getRowKey={(row) => row.id}
        searchValue=""
        onSearchChange={handleSearch}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText("Search..."),
      {
        target: { value: "john" },
      },
    );

    expect(handleSearch).toHaveBeenCalled();
  });
});