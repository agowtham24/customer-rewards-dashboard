import PropTypes from "prop-types";
import PaginatedRewardsTab from "./PaginatedRewardsTab";
import { transactionColumns } from "../config/rewardsColumns";

/**
 * Transactions tab.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
function TransactionsTab(props) {
  return (
    <PaginatedRewardsTab
      title="Transactions"
      description="Each purchase with its reward points."
      columns={transactionColumns}
      getRowKey={(row) => row.transactionId}
      searchPlaceholder="Search transactions..."
      {...props}
    />
  );
}

TransactionsTab.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default TransactionsTab;