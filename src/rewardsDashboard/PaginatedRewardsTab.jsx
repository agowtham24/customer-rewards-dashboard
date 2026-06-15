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

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    setCurrentPage(1);
  }, [rows, searchValue, pageSize]);

  function handleSort(accessor) {
    if (sortColumn === accessor) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(accessor);
      setSortDirection("asc");
    }
  }

  const sortedRows = useMemo(() => {
    if (!sortColumn) {
      return rows;
    }

    return [...rows].sort((a, b) => {
      const left = a[sortColumn];
      const right = b[sortColumn];

      if (typeof left === "number" && typeof right === "number") {
        return sortDirection === "asc"
          ? left - right
          : right - left;
      }

      return sortDirection === "asc"
        ? String(left).localeCompare(String(right))
        : String(right).localeCompare(String(left));
    });
  }, [rows, sortColumn, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedRows.length / pageSize),
  );

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return sortedRows.slice(startIndex, endIndex);
  }, [sortedRows, currentPage, pageSize]);

  const showPagination =
    !loading && sortedRows.length > pageSize;

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
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {showPagination && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={sortedRows.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
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