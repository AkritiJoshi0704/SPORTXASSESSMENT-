import React, { useState } from "react";

const AdCard = ({ campaign, onUpdateStatus, onUpdate, onDelete }) => {
  const {
    id,
    name,
    advertiser,
    status,
    impressions,
    ctr,
    budget_total,
    budget_spent,
  } = campaign;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name,
    advertiser,
    status,
    impressions,
    ctr,
    budget_total,
    budget_spent,
  });

  const submitUpdate = () => {
    if (onUpdate) {
      onUpdate(id, {
        name: String(form.name || '').trim(),
        advertiser: String(form.advertiser || '').trim(),
        status: form.status,
        impressions: Number(form.impressions) || 0,
        ctr: Number(form.ctr) || 0,
        budget_total: Number(form.budget_total) || 0,
        budget_spent: Number(form.budget_spent) || 0,
      });
      setEditing(false);
    }
  };

  // Calculate budget percentage (guard against division by zero)
  const budgetPercentage =
    budget_total > 0 ? (budget_spent / budget_total) * 100 : 0;

  // Status badge colors
  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
    ended: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Format numbers
  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer">
      {/* Header: Logo and Campaign Name */}
      <div className="flex items-start gap-4 mb-4">
        {/* Placeholder Logo */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {advertiser.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-gray-900 text-lg truncate"
            title={name}
          >
            {name}
          </h3>
          <p className="text-sm text-gray-500">{advertiser}</p>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status]} capitalize flex-shrink-0`}
        >
          {status}
        </span>
      </div>

      {/* Metrics: Impressions and CTR */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Impressions
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatNumber(impressions)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">CTR</p>
          <p className="text-xl font-bold text-gray-900">{ctr}%</p>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Budget Spent
          </p>
          <p className="text-sm font-medium text-gray-700">
            ${formatNumber(budget_spent)} / ${formatNumber(budget_total)}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">
          {budgetPercentage.toFixed(1)}%
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Change Status:</p>
        <div className="flex gap-2">
          {status !== "active" && (
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(id, "active")}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
            >
              Active
            </button>
          )}
          {status !== "paused" && (
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(id, "paused")}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
            >
              Paused
            </button>
          )}
          {status !== "ended" && (
            <button
              onClick={() => onUpdateStatus && onUpdateStatus(id, "ended")}
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Ended
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button
            onClick={() => onDelete && onDelete(id)}
            className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="p-2 border" />
            <input value={form.advertiser} onChange={(e) => setForm({...form, advertiser: e.target.value})} className="p-2 border" />
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="p-2 border">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="ended">Ended</option>
            </select>
            <input type="number" value={form.impressions} onChange={(e) => setForm({...form, impressions: e.target.value})} className="p-2 border" />
            <input type="number" step="0.1" value={form.ctr} onChange={(e) => setForm({...form, ctr: e.target.value})} className="p-2 border" />
            <input type="number" value={form.budget_total} onChange={(e) => setForm({...form, budget_total: e.target.value})} className="p-2 border" />
            <input type="number" value={form.budget_spent} onChange={(e) => setForm({...form, budget_spent: e.target.value})} className="p-2 border" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={submitUpdate} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdCard;
