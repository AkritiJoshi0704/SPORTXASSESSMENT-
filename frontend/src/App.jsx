import React, { useState, useMemo, useEffect } from "react";
import AdCard from "./components/AdCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_KEY = import.meta.env.VITE_API_KEY || "spotx-secret-key-2024";

function App() {
  // Data states
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("impressions");

  // Create campaign form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    advertiser: "",
    status: "active",
    impressions: 0,
    ctr: 0,
    budget_total: 0,
    budget_spent: 0,
  });

  // Fetch campaigns from backend (reusable function)
  const fetchCampaigns = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }

      const response = await fetch(`${API_URL}/campaigns`, {
        headers: {
          "X-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCampaigns(data.data);
      setLoading(false);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      if (showRefreshIndicator) {
        setIsRefreshing(false);
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Update campaign status
  const updateCampaignStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/campaigns/${id}/status`, {
        method: "PATCH",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      // Refresh campaigns after update (real-time sync)
      await fetchCampaigns();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Update full campaign
  const updateCampaign = async (id, campaignData) => {
    try {
      const response = await fetch(`${API_URL}/campaigns/${id}`, {
        method: 'PATCH',
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update campaign');
      }

      await fetchCampaigns();
    } catch (err) {
      alert('Failed to update campaign: ' + err.message);
    }
  };

  // Delete campaign
  const deleteCampaign = async (id) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      const response = await fetch(`${API_URL}/campaigns/${id}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': API_KEY },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete campaign');
      }

      await fetchCampaigns();
    } catch (err) {
      alert('Failed to delete campaign: ' + err.message);
    }
  };

  // Create new campaign
  const createCampaign = async (campaignData) => {
    try {
      const response = await fetch(`${API_URL}/campaigns`, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create campaign");
      }

      // Refresh campaigns after creation (real-time sync)
      await fetchCampaigns();

      // Reset form and close
      setNewCampaign({
        name: "",
        advertiser: "",
        status: "active",
        impressions: 0,
        ctr: 0,
        budget_total: 0,
        budget_spent: 0,
      });
      setShowCreateForm(false);

      alert("Campaign created successfully!");
    } catch (err) {
      alert("Failed to create campaign: " + err.message);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createCampaign(newCampaign);
  };

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    let result = [...campaigns];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((campaign) => campaign.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((campaign) =>
        campaign.name.toLowerCase().includes(query),
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "impressions") {
        return b.impressions - a.impressions;
      } else if (sortBy === "ctr") {
        return b.ctr - a.ctr;
      }
      return 0;
    });

    return result;
  }, [campaigns, statusFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Campaign Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your DOOH campaigns
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Campaign Button */}
        <div className="mb-4 flex gap-3">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showCreateForm ? "Cancel" : "+ Create New Campaign"}
          </button>
          <button
            onClick={() => fetchCampaigns(true)}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              "Refresh Data"
            )}
          </button>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Campaign
            </h2>
            <form
              onSubmit={handleCreateSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Summer Sale"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advertiser *
                </label>
                <input
                  type="text"
                  required
                  value={newCampaign.advertiser}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      advertiser: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Nike"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={newCampaign.status}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impressions *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newCampaign.impressions}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      impressions: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTR % *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  value={newCampaign.ctr}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      ctr: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Budget *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newCampaign.budget_total}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      budget_total: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Spent *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newCampaign.budget_spent}
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      budget_spent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="ended">Ended</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Campaigns
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by campaign name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Sort */}
            <div className="flex-1">
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="impressions">Impressions (High to Low)</option>
                <option value="ctr">CTR (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedCampaigns.length} of {campaigns.length}{" "}
            campaigns
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading campaigns...
            </h3>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error loading campaigns
            </h3>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure the backend server is running on port 3001
            </p>
          </div>
        ) : filteredAndSortedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCampaigns.map((campaign) => (
              <AdCard
                key={campaign.id}
                campaign={campaign}
                onUpdateStatus={updateCampaignStatus}
                onUpdate={updateCampaign}
                onDelete={deleteCampaign}
              />
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
