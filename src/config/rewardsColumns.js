export const monthlyColumns = [
  {
    header: "Customer ID",
    accessor: "customerId",
    sortable: true,
  },
  {
    header: "Name",
    accessor: "name",
    sortable: true,
  },
  {
    header: "Month",
    accessor: "monthIndex",
    sortable: true,
    render: (row) => row.month,
  },
  {
    header: "Year",
    accessor: "year",
    sortable: true,
  },
  {
    header: "Reward Points",
    accessor: "rewardPoints",
    sortable: true,
    cellClassName: "font-semibold",
  },
];
export const totalColumns = [
  {
    header: "Customer Name",
    accessor: "name",
    sortable: true,
  },
  {
    header: "Reward Points",
    accessor: "rewardPoints",
    sortable: true,
    cellClassName: "font-semibold",
  },
];

export const transactionColumns = [
  {
    header: "Transaction ID",
    accessor: "transactionId",
    sortable: true,
  },
  {
    header: "Customer Name",
    accessor: "customerName",
    sortable: true,
  },
  {
    header: "Purchase Date",
    accessor: "purchaseDate",
    sortable: true,
    render: (row) => row.formattedPurchaseDate,
  },
  {
    header: "Product Purchased",
    accessor: "productPurchased",
    sortable: true,
  },
  {
    header: "Price",
    accessor: "price",
    sortable: true,
    render: (row) => row.formattedPrice,
  },
  {
    header: "Reward Points",
    accessor: "rewardPoints",
    sortable: true,
    cellClassName: "font-semibold",
  },
];
