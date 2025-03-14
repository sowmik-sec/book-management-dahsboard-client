/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useGetSaleHistoryQuery } from "../redux/features/sale/saleApi";

const SaleHistory = () => {
  // State for query parameters
  const [query, setQuery] = useState({
    period: "week" as string,
    sortBy: "_id" as string,
    sortOrder: "desc" as "asc" | "desc",
    page: 1 as number,
    limit: 10 as number,
  });

  // Fetch sales history
  const { data: historyData, isLoading } = useGetSaleHistoryQuery(query);

  // Loading state
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  // Handlers for UI changes
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuery((prev) => ({ ...prev, period: e.target.value, page: 1 }));
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuery((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handleSortOrderChange = () => {
    setQuery((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (historyData?.meta.totalPage || 1)) {
      setQuery((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Destructure data with fallbacks
  const meta = historyData?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };
  const result = historyData?.data?.result || [];
  console.log(historyData);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Sales History</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <div>
          <label htmlFor="period" className="mr-2 font-medium">
            Period:
          </label>
          <select
            id="period"
            value={query.period}
            onChange={handlePeriodChange}
            className="p-2 border rounded-md"
          >
            <option value="dayOfMonth">Day of Month</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortBy" className="mr-2 font-medium">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={query.sortBy}
            onChange={handleSortByChange}
            className="p-2 border rounded-md"
          >
            <option value="_id">{query.period}</option>
            <option value="totalPrice">Total Price</option>
            <option value="totalBookSold">Total Books Sold</option>
          </select>
        </div>
        <button
          onClick={handleSortOrderChange}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {query.sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>

      {/* Sales Data Table */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Sales Summary</h2>
        {result.length === 0 ? (
          <p className="text-center">No sales data available</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Period</th>
                <th className="p-2">Total Price</th>
                <th className="p-2">Books Sold</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item: any) => (
                <tr key={item._id} className="border-t">
                  <td className="p-2">{item._id}</td>
                  <td className="p-2">${item.totalPrice.toLocaleString()}</td>
                  <td className="p-2">{item.totalBookSold.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => handlePageChange(query.page - 1)}
          disabled={query.page === 1}
          className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {meta.page} of {meta.totalPage} (Total: {meta.total})
        </span>
        <button
          onClick={() => handlePageChange(query.page + 1)}
          disabled={query.page === meta.totalPage}
          className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SaleHistory;
