import { renderHook, waitFor, act } from "@testing-library/react";
import { useTransactions } from "../hooks/useTransactions";

const mockTransactions = [
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
  {
    transactionId: "TXN-0003",
    customerId: "C003",
    firstName: "Rahul",
    lastName: "Mehta",
    purchaseDate: "2026-07-15",
    productPurchased: "Monitor",
    price: 75,
  },
  {
    transactionId: "TXN-0004",
    customerId: "C004",
    firstName: "Neha",
    lastName: "Iyer",
    purchaseDate: "2026-03-20",
    productPurchased: "USB Hub",
    price: 60,
  },
];

describe("useTransactions", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loads transactions and keeps only the latest 3-month window", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTransactions,
    });

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();

    expect(result.current.transactions).toHaveLength(3);
    expect(result.current.transactions.map((item) => item.transactionId)).toEqual([
      "TXN-0001",
      "TXN-0002",
      "TXN-0003",
    ]);

    expect(result.current.transactions[0].customerName).toBe("Aarav Sharma");
    expect(result.current.transactions[1].customerName).toBe("Priya Verma");
    expect(result.current.transactions[2].customerName).toBe("Rahul Mehta");
  });

  test("sets error when fetch fails", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => [],
    });

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.transactions).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Failed to fetch transactions");
  });

  test("reload fetches again", async () => {
    globalThis.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions.slice(1),
      });

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.transactions).toHaveLength(3);

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});