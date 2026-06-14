import PropTypes from "prop-types";
import PaginatedRewardsTab from "./PaginatedRewardsTab";
import { monthlyColumns } from "../config/rewardsColumns";

/**
 * Monthly rewards tab.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
function MonthlyRewardsTab(props) {
  return (
    <PaginatedRewardsTab
      title="User Monthly Rewards"
      description="Grouped by customer, month, and year."
      columns={monthlyColumns}
      getRowKey={(row) =>
        `${row.customerId}-${row.year}-${row.monthIndex}`
      }
      searchPlaceholder="Search monthly rewards..."
      {...props}
    />
  );
}

MonthlyRewardsTab.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default MonthlyRewardsTab;