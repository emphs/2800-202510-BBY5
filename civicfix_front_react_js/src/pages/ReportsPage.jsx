import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { CircleArrowUp, CircleArrowDown } from "lucide-react";

async function getReports() {
  const reports = await (await fetch("/api/issues")).json();
  return reports;
}

async function changeVote(vote, reportId) {
  const response = await fetch(`/api/issues/vote/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vote }),
  });
  console.log("Vote update response:", response);
}

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("date");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports()
      .then((reports) => setReports(reports))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />
      <main className="flex-grow-1 bg-light" style={{ paddingTop: "80px" }}>
        {/* Search Section */}
        <div className="container py-4" style={{ minHeight: "20vh" }}>
          <form className="row g-2 align-items-center">
            <div className="col-auto flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
            <div className="col-12 col-md-6 mt-2">
              <select
                className="form-select"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}>
                <option value="date">Order by Date</option>
                <option value="title">Order by Title</option>
                <option value="votes">Order by Vote Count</option>
              </select>
            </div>
          </form>
        </div>
        {/* Display Section */}
        <div className="container pb-5">
          <div className="flex flex-col g-5">
            {/* Placeholder for report cards */}
            {reports.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">No reports to display.</div>
            ) : (
              reports.map((report, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={report.id || idx}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">{report.title}</h5>
                      <p className="card-text">{report.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="badge bg-gray-200 p-2">
                          {new Date(report.date_created).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <div className="flex flex-row gap-1 bg-gray-300 py-1 px-2 rounded-2xl">
                          <CircleArrowUp
                            fill={report.user_voted === 1 ? "#73da88" : "none"}
                            onClick={() => changeVote(1, report.id, idx)}
                          />
                          <CircleArrowDown
                            fill={report.voted === -1 ? "#73da88" : "none"}
                            onClick={() => changeVote(-1)}
                          />
                        </div>
                        <span className="badge bg-info">Votes: {report.vote_total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
