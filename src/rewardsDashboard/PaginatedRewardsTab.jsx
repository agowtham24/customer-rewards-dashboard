import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import RewardsSection from "../components/RewardsSection";
import PaginationControls from "./PaginationControls";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Generic paginated rewards tab.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
function PaginatedRewardsTab({
  title,
  description,
  columns,
  rows,
  loading,
  getRowKey,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [rows, searchValue, pageSize]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return rows.slice(startIndex, endIndex);
  }, [rows, currentPage, pageSize]);

  const showPagination = !loading && rows.length > pageSize;

  return (
    <div className="space-y-4">
      <RewardsSection
        title={title}
        description={description}
        columns={columns}
        rows={paginatedRows}
        loading={loading}
        getRowKey={getRowKey}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
      />

      {showPagination ? (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={rows.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      ) : null}
    </div>
  );
}

PaginatedRewardsTab.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  getRowKey: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
};

export default PaginatedRewardsTab;