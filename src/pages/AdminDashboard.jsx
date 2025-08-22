import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ for redirect
import AdminNavbar from "../components/AdminNavbar";
import {
  getVolunteers,
  addVolunteer,
  deleteVolunteerByEmail,
} from "../utils/api";
import "../styles/AdminDashboard.css";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [email, setEmail] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteEmail, setPendingDeleteEmail] = useState("");

  const navigate = useNavigate(); // ✅ hook for navigation

  useEffect(() => {
    loadVolunteers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data = await getVolunteers(); // axios already returns data
      setVolunteers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const onAddVolunteer = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setSubmitting(true);
      await addVolunteer(email.trim()); // expects { user_email }
      toast.success("Volunteer added");
      setEmail("");
      await loadVolunteers();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to add volunteer");
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteEmailSubmit = async (e) => {
    e.preventDefault();
    if (!deleteEmail.trim()) return;
    openConfirm(deleteEmail.trim());
  };

  const openConfirm = (mail) => {
    setPendingDeleteEmail(mail);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteVolunteerByEmail(pendingDeleteEmail);
      toast.success("Volunteer deleted");
      setDeleteEmail("");
      await loadVolunteers();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to delete volunteer");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setPendingDeleteEmail("");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return volunteers;
    return volunteers.filter((v) => {
      const email = (v.email || "").toLowerCase();
      const name = (v.name || "").toLowerCase();
      const uid = String(v.user_id || "");
      return email.includes(q) || name.includes(q) || uid.includes(q);
    });
  }, [volunteers, search]);

  return (
    <div className="admin-dashboard">
      {/* ✅ Back to Dashboard button */}
      <div className="top-actions">
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")} // change if your dashboard route is different
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="dashboard-container">
        <header className="page-header">
          <div>
            <h2>Volunteer Management</h2>
            <p className="sub">Add, search, and remove volunteers by email.</p>
          </div>
          <div className="search-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, email, or user id…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search volunteers"
            />
          </div>
        </header>

        <section className="grid-cards">
          <div className="card">
            <h3>Add Volunteer</h3>
            <form className="form row" onSubmit={onAddVolunteer}>
              <input
                type="email"
                placeholder="Enter volunteer email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
              <button type="submit" disabled={submitting}>
                {submitting ? "Adding…" : "Add"}
              </button>
            </form>
            <p className="hint">Only existing users can be added as volunteers.</p>
          </div>

          <div className="card">
            <h3>Delete Volunteer (by Email)</h3>
            <form className="form row" onSubmit={onDeleteEmailSubmit}>
              <input
                type="email"
                placeholder="Enter email to delete"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                required
                autoComplete="off"
              />
              <button type="submit" className="danger">
                Delete
              </button>
            </form>
            <p className="hint">You’ll be asked to confirm before deletion.</p>
          </div>
        </section>

        <section className="card">
          <div className="list-head">
            <h3>Current Volunteers</h3>
            <span className="pill">{filtered.length}</span>
          </div>

          {loading ? (
            <div className="skeleton-list">
              <div className="skeleton-row" />
              <div className="skeleton-row" />
              <div className="skeleton-row" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <p>No volunteers found.</p>
            </div>
          ) : (
            <ul className="volunteer-list">
              {filtered.map((v) => (
                <li key={v.volunteer_id ?? v.user_id}>
                  <div className="vol-meta">
                    <div className="vol-primary">
                      <span className="vol-name">{v.name || "—"}</span>
                      <span className="vol-email">{v.email || "—"}</span>
                    </div>
                    <div className="vol-secondary">
                      <span className="vol-id">User ID: {v.user_id}</span>
                      {v.volunteer_id && (
                        <span className="vol-id muted">
                          Volunteer ID: {v.volunteer_id}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className="danger"
                    onClick={() => openConfirm(v.email)}
                    aria-label={`Delete ${v.email}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {confirmOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <h4>Confirm deletion</h4>
            <p>
              Are you sure you want to remove{" "}
              <strong>{pendingDeleteEmail}</strong> from volunteers?
            </p>
            <div className="modal-actions">
              <button onClick={() => setConfirmOpen(false)} disabled={deleting}>
                Cancel
              </button>
              <button className="danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
