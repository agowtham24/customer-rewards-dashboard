import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { normalizeTransaction, isWithinLastThreeMonths } from "../lib/utils";

/**
 * Fetches transaction data and keeps only the latest rolling three-month window.
 *
 * @returns {{
 *   transactions: Array,
 *   loading: boolean,
 *   error: Error | null,
 *   reload: Function
 * }}
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("transactions.json");

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid transactions data");
      }

      const normalized = data.map(normalizeTransaction);

      const latestDate = normalized.reduce((latest, transaction) => {
        const currentDate = dayjs(transaction.purchaseDate);

        if (!currentDate.isValid()) {
          return latest;
        }

        if (!latest || currentDate.isAfter(dayjs(latest))) {
          return transaction.purchaseDate;
        }

        return latest;
      }, null);

      const filtered =
        latestDate == null
          ? []
          : normalized.filter((transaction) =>
              isWithinLastThreeMonths(transaction.purchaseDate, latestDate),
            );

      setTransactions(filtered);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError
          : new Error("Unable to load transaction data."),
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    reload: loadTransactions,
  };
}
