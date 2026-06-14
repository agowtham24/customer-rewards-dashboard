import PropTypes from "prop-types";
import PaginatedRewardsTab from "./PaginatedRewardsTab";
import { totalColumns } from "../config/rewardsColumns";

/**
 * Total rewards tab.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
function TotalRewardsTab(props) {
  return (
    <PaginatedRewardsTab
      title="Total Rewards"
      description="Total reward points accumulated by each customer."
      columns={totalColumns}
      getRowKey={(row) => row.customerId}
      searchPlaceholder="Search customers..."
      {...props}
    />
  );
}

TotalRewardsTab.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default TotalRewardsTab;