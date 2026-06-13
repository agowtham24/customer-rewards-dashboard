import dayjs from "dayjs";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names safely.
 *
 * @param {...unknown} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Validates and normalizes a reward amount.
 *
 * @param {unknown} amount
 * @returns {number}
 * @throws {Error} If amount is undefined, null, NaN, not numeric, or negative.
 */
export function validatePrice(amount) {
  if (amount === undefined || amount === null) {
    throw new Error("Price is required.");
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    throw new Error("Price must be a valid number.");
  }

  if (numericAmount < 0) {
    throw new Error("Price cannot be negative.");
  }

  return numericAmount;
}

/**
 * Calculates reward points for a purchase amount.
 *
 * Rules:
 * - 0 points for $50 or less
 * - 1 point per dollar over $50 up to $100
 * - 2 points per dollar over $100, plus 50 base points
 *
 * @param {unknown} amount
 * @returns {number}
 */
export function calculateRewardPoints(amount) {
  const numericAmount = validatePrice(amount);

  if (numericAmount <= 50) {
    return 0;
  }

  const wholeDollars = Math.floor(numericAmount);

  if (wholeDollars <= 100) {
    return wholeDollars - 50;
  }

  return (wholeDollars - 100) * 2 + 50;
}

/**
 * Safely parses a date string using dayjs.
 *
 * @param {string} dateValue
 * @returns {dayjs.Dayjs}
 * @throws {Error} If date is invalid.
 */
function parseDate(dateValue) {
  const parsed = dayjs(dateValue);

  if (!parsed.isValid()) {
    throw new Error(`Invalid date: ${dateValue}`);
  }

  return parsed;
}

/**
 * Formats a number as USD currency.
 *
 * @param {unknown} amount
 * @returns {string}
 * @throws {Error} If amount is not numeric.
 */
export function formatCurrency(amount) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    throw new Error("Amount must be a valid number.");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
}

/**
 * Formats a date for display.
 *
 * @param {string} dateValue
 * @returns {string}
 */
export function formatDisplayDate(dateValue) {
  return parseDate(dateValue).format("MMM DD, YYYY");
}

/**
 * Returns date parts used for grouping and display.
 *
 * @param {string} dateValue
 * @returns {{
 *   date: dayjs.Dayjs,
 *   year: number,
 *   monthIndex: number,
 *   monthName: string
 * }}
 */
export function getDateParts(dateValue) {
  const date = parseDate(dateValue);

  return {
    date,
    year: date.year(),
    monthIndex: date.month(),
    monthName: date.format("MMMM"),
  };
}

/**
 * Sorts transactions from most recent to least recent.
 *
 * @param {Array<Object>} transactions
 * @returns {Array<Object>}
 */
export function sortTransactionsByDate(transactions) {
  return [...transactions].sort((left, right) => {
    const leftDate = parseDate(left.purchaseDate);
    const rightDate = parseDate(right.purchaseDate);

    if (!leftDate.isSame(rightDate)) {
      return rightDate.valueOf() - leftDate.valueOf();
    }

    return String(left.transactionId).localeCompare(
      String(right.transactionId),
    );
  });
}

/**
 * Enriches transactions with reward points and display fields.
 * Assumes transactions are already filtered and sorted upstream.
 *
 * @param {Array<Object>} transactions
 * @returns {Array<Object>}
 */
export function enrichTransactions(transactions) {
  return transactions.map((transaction) => ({
    ...transaction,
    rewardPoints: calculateRewardPoints(transaction.price),
    formattedPurchaseDate: formatDisplayDate(transaction.purchaseDate),
    formattedPrice: formatCurrency(transaction.price),
  }));
}

/**
 * Groups transactions by customer, month, and year.
 * Returns results sorted from most recent month to least recent month.
 *
 * @param {Array<Object>} transactions
 * @returns {Array<{
 *   customerId: string,
 *   name: string,
 *   month: string,
 *   monthIndex: number,
 *   year: number,
 *   rewardPoints: number
 * }>}
 */
export function calculateMonthlyRewards(transactions) {
  const grouped = transactions.reduce((acc, transaction) => {
    const points = calculateRewardPoints(transaction.price);
    const { year, monthIndex, monthName } = getDateParts(
      transaction.purchaseDate,
    );
    const key = `${transaction.customerId}-${year}-${monthIndex}`;

    if (!acc.has(key)) {
      acc.set(key, {
        customerId: transaction.customerId,
        name: transaction.customerName,
        month: monthName,
        monthIndex,
        year,
        rewardPoints: 0,
      });
    }

    acc.get(key).rewardPoints += points;
    return acc;
  }, new Map());

  return [...grouped.values()].sort((left, right) => {
    const nameComparison = String(left.name).localeCompare(String(right.name));

    if (nameComparison !== 0) {
      return nameComparison;
    }

    if (left.year !== right.year) {
      return right.year - left.year;
    }

    return right.monthIndex - left.monthIndex;
  });
}

/**
 * Calculates total reward points per customer.
 *
 * @param {Array<Object>} transactions
 * @returns {Array<{
 *   customerId: string,
 *   name: string,
 *   rewardPoints: number
 * }>}
 */
export function calculateTotalRewards(transactions) {
  const grouped = transactions.reduce((acc, transaction) => {
    const points = calculateRewardPoints(transaction.price);
    const key = transaction.customerId;

    if (!acc.has(key)) {
      acc.set(key, {
        customerId: transaction.customerId,
        name: transaction.customerName,
        rewardPoints: 0,
      });
    }

    acc.get(key).rewardPoints += points;
    return acc;
  }, new Map());

  return [...grouped.values()].sort((left, right) =>
    String(left.name).localeCompare(String(right.name)),
  );
}

/**
 * Builds customer full name.
 *
 * @param {Object} transaction
 * @returns {Object}
 */
export function normalizeTransaction(transaction) {
  const firstName = transaction.firstName ?? "";
  const lastName = transaction.lastName ?? "";

  return {
    ...transaction,
    customerName: `${firstName} ${lastName}`.trim(),
  };
}

/**
 * Checks whether a date belongs to the latest rolling 3-month window.
 *
 * @param {string} purchaseDate
 * @param {string} latestDate
 * @returns {boolean}
 */
export function isWithinLastThreeMonths(purchaseDate, latestDate) {
  const current = dayjs(purchaseDate);
  const latest = dayjs(latestDate);

  if (!current.isValid() || !latest.isValid()) {
    throw new Error("Invalid date provided.");
  }

  const startDate = latest.subtract(2, "month").startOf("month");
  const endDate = latest.endOf("month");

  return (
    (current.isSame(startDate) || current.isAfter(startDate)) &&
    (current.isSame(endDate) || current.isBefore(endDate.add(1, "day")))
  );
}
