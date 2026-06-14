import { useMemo, useState } from "react";
import { cn } from "../lib/utils";
import { ScrollArea, ScrollBar } from "../components/ui/ScrollArea";
import { exportToCsv } from "../lib/exportCsv";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { useDebounce } from "../hooks/useDebounce";
import { useTransactions } from "../hooks/useTransactions";
import {
  calculateMonthlyRewards,
  calculateTotalRewards,
  enrichTransactions,
  sortTransactionsByDate,
} from "../lib/utils";
import MonthlyRewardsTab from "./MonthlyRewardsTab";
import TotalRewardsTab from "./TotalRewardsTab";
import TransactionsTab from "./TransactionsTab";

function RewardsDashboard() {
  const { transactions, loading, error, reload } = useTransactions();

  const [activeTab, setActiveTab] = useState("transactions");
  const [monthlySearch, setMonthlySearch] = useState("");
  const [totalSearch, setTotalSearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");

  const debouncedMonthlySearch = useDebounce(monthlySearch, 300);
  const debouncedTotalSearch = useDebounce(totalSearch, 300);
  const debouncedTransactionSearch = useDebounce(transactionSearch, 300);

  const [theme, setTheme] = useState("default");

  const sortedTransactions = useMemo(
    () => sortTransactionsByDate(transactions),
    [transactions],
  );

  const monthlyRewards = useMemo(
    () => calculateMonthlyRewards(sortedTransactions),
    [sortedTransactions],
  );

  const totalRewards = useMemo(
    () => calculateTotalRewards(sortedTransactions),
    [sortedTransactions],
  );

  const transactionRows = useMemo(
    () => enrichTransactions(sortedTransactions),
    [sortedTransactions],
  );

  const filteredMonthlyRewards = useMemo(() => {
    const query = debouncedMonthlySearch.trim().toLowerCase();

    if (!query) {
      return monthlyRewards;
    }

    return monthlyRewards.filter((reward) =>
      [reward.customerId, reward.name, reward.month, String(reward.year)].some(
        (value) => String(value).toLowerCase().includes(query),
      ),
    );
  }, [monthlyRewards, debouncedMonthlySearch]);

  const filteredTotalRewards = useMemo(() => {
    const query = debouncedTotalSearch.trim().toLowerCase();

    if (!query) {
      return totalRewards;
    }

    return totalRewards.filter((reward) =>
      [reward.customerId, reward.name].some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [totalRewards, debouncedTotalSearch]);

  const filteredTransactions = useMemo(() => {
    const query = debouncedTransactionSearch.trim().toLowerCase();

    if (!query) {
      return transactionRows;
    }

    return transactionRows.filter((transaction) =>
      [
        transaction.transactionId,
        transaction.customerId,
        transaction.customerName,
        transaction.productPurchased,
        transaction.formattedPurchaseDate,
        transaction.formattedPrice,
      ].some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [transactionRows, debouncedTransactionSearch]);

  const handleExportCsv = () => {
    switch (activeTab) {
      case "transactions":
        exportToCsv(filteredTransactions, "transactions.csv");
        break;

      case "monthly":
        exportToCsv(
          filteredMonthlyRewards.map((item) => ({
            customerId: item.customerId,
            name: item.name,
            month: item.month,
            year: item.year,
            rewardPoints: item.rewardPoints,
          })),
          "monthly-rewards.csv",
        );
        break;

      case "total":
        exportToCsv(filteredTotalRewards, "total-rewards.csv");
        break;

      default:
        break;
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        theme === "ocean" && "theme-ocean",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Customer Rewards Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Rewards for the latest rolling three-month window.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="default">Default Theme</SelectItem>

                <SelectItem value="ocean">Ocean Blue</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExportCsv} disabled={loading}>
              Export CSV
            </Button>

            <Button onClick={reload} disabled={loading}>
              {loading ? "Loading..." : "Reload Data"}
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="mb-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">
                Something went wrong
              </CardTitle>
              <CardDescription>{error?.message}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={reload}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!loading && !error && transactions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No data available</CardTitle>
              <CardDescription>
                The dataset returned no transactions in the latest 3-month
                window.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {(loading || transactions.length > 0) && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList variant="line" className="inline-flex w-max gap-2">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Rewards</TabsTrigger>
                <TabsTrigger value="total">Total Rewards</TabsTrigger>
              </TabsList>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="transactions" className="mt-6">
              <TransactionsTab
                rows={filteredTransactions}
                loading={loading}
                searchValue={transactionSearch}
                onSearchChange={(event) =>
                  setTransactionSearch(event.target.value)
                }
              />
            </TabsContent>

            <TabsContent value="monthly" className="mt-6">
              <MonthlyRewardsTab
                rows={filteredMonthlyRewards}
                loading={loading}
                searchValue={monthlySearch}
                onSearchChange={(event) => setMonthlySearch(event.target.value)}
              />
            </TabsContent>

            <TabsContent value="total" className="mt-6">
              <TotalRewardsTab
                rows={filteredTotalRewards}
                loading={loading}
                searchValue={totalSearch}
                onSearchChange={(event) => setTotalSearch(event.target.value)}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default RewardsDashboard;
