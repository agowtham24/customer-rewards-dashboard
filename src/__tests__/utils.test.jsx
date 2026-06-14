import {
  calculateRewardPoints,
  calculateMonthlyRewards,
  calculateTotalRewards,
  enrichTransactions,
  sortTransactionsByDate,
  formatCurrency,
  formatDisplayDate,
} from "../lib/utils";

describe("calculateRewardPoints", () => {
  test("returns 0 for amounts below or equal to 50", () => {
    expect(calculateRewardPoints(0)).toBe(0);
    expect(calculateRewardPoints(49.99)).toBe(0);
    expect(calculateRewardPoints(50)).toBe(0);
  });

  test("returns 1 point per dollar between 50 and 100", () => {
    expect(calculateRewardPoints(51)).toBe(1);
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(100)).toBe(50);
  });

  test("handles decimals correctly", () => {
    expect(calculateRewardPoints(100.2)).toBe(50);
    expect(calculateRewardPoints(100.4)).toBe(50);
    expect(calculateRewardPoints(120.9)).toBe(90);
  });

  test("returns correct points above 100", () => {
    expect(calculateRewardPoints(101)).toBe(52);
    expect(calculateRewardPoints(120)).toBe(90);
    expect(calculateRewardPoints(130)).toBe(110);
  });

  test("throws for invalid values", () => {
    expect(() => calculateRewardPoints(undefined)).toThrow(
      "Price is required.",
    );
    expect(() => calculateRewardPoints(null)).toThrow("Price is required.");
    expect(() => calculateRewardPoints("abc")).toThrow(
      "Price must be a valid number.",
    );
    expect(() => calculateRewardPoints(-1)).toThrow(
      "Price cannot be negative.",
    );
  });
});

describe("format helpers", () => {
  test("formats currency", () => {
    expect(formatCurrency(120.4)).toBe("$120.40");
  });

  test("formats display date", () => {
    expect(formatDisplayDate("2026-05-01")).toBe("May 01, 2026");
  });

  test("throws for invalid currency values", () => {
    expect(() => formatCurrency("abc")).toThrow(
      "Amount must be a valid number.",
    );
  });
});

describe("sortTransactionsByDate", () => {
  test("sorts transactions from most recent to least recent", () => {
    const transactions = [
      { transactionId: "TXN-3", purchaseDate: "2026-05-10" },
      { transactionId: "TXN-1", purchaseDate: "2026-07-15" },
      { transactionId: "TXN-2", purchaseDate: "2026-06-05" },
    ];

    const sorted = sortTransactionsByDate(transactions);

    expect(sorted.map((item) => item.transactionId)).toEqual([
      "TXN-1",
      "TXN-2",
      "TXN-3",
    ]);
  });
});

describe("calculateMonthlyRewards", () => {
  const transactions = [
    {
      transactionId: "TXN-1",
      customerId: "C001",
      customerName: "John Doe",
      purchaseDate: "2026-05-15",
      price: 120,
    },
    {
      transactionId: "TXN-2",
      customerId: "C001",
      customerName: "John Doe",
      purchaseDate: "2026-06-05",
      price: 60,
    },
    {
      transactionId: "TXN-3",
      customerId: "C001",
      customerName: "John Doe",
      purchaseDate: "2026-07-10",
      price: 99.9,
    },
    {
      transactionId: "TXN-4",
      customerId: "C002",
      customerName: "Jane Smith",
      purchaseDate: "2026-06-11",
      price: 101.2,
    },
  ];

  test("groups by customer, month, and year and sorts by customer and recency", () => {
    const result = calculateMonthlyRewards(transactions);

    expect(result).toEqual([
      {
        customerId: "C002",
        name: "Jane Smith",
        month: "June",
        monthIndex: 5,
        year: 2026,
        rewardPoints: 52,
      },
      {
        customerId: "C001",
        name: "John Doe",
        month: "July",
        monthIndex: 6,
        year: 2026,
        rewardPoints: 49,
      },
      {
        customerId: "C001",
        name: "John Doe",
        month: "June",
        monthIndex: 5,
        year: 2026,
        rewardPoints: 10,
      },
      {
        customerId: "C001",
        name: "John Doe",
        month: "May",
        monthIndex: 4,
        year: 2026,
        rewardPoints: 90,
      },
    ]);
  });
});

describe("calculateTotalRewards", () => {
  const transactions = [
    {
      transactionId: "TXN-1",
      customerId: "C001",
      customerName: "John Doe",
      purchaseDate: "2026-05-15",
      price: 120,
    },
    {
      transactionId: "TXN-2",
      customerId: "C001",
      customerName: "John Doe",
      purchaseDate: "2026-06-05",
      price: 60,
    },
    {
      transactionId: "TXN-3",
      customerId: "C002",
      customerName: "Jane Smith",
      purchaseDate: "2026-06-11",
      price: 101.2,
    },
  ];

  test("returns totals per customer sorted alphabetically by name", () => {
    const result = calculateTotalRewards(transactions);

    expect(result).toEqual([
      {
        customerId: "C002",
        name: "Jane Smith",
        rewardPoints: 52,
      },
      {
        customerId: "C001",
        name: "John Doe",
        rewardPoints: 100,
      },
    ]);
  });
});

describe("enrichTransactions", () => {
  test("adds reward points and formatted fields", () => {
    const result = enrichTransactions([
      {
        transactionId: "TXN-1",
        customerId: "C001",
        customerName: "John Doe",
        purchaseDate: "2026-06-05",
        productPurchased: "Keyboard",
        price: 60,
      },
    ]);

    expect(result).toEqual([
      {
        transactionId: "TXN-1",
        customerId: "C001",
        customerName: "John Doe",
        purchaseDate: "2026-06-05",
        productPurchased: "Keyboard",
        price: 60,
        rewardPoints: 10,
        formattedPurchaseDate: "Jun 05, 2026",
        formattedPrice: "$60.00",
      },
    ]);
  });
});
