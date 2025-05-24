import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

import { MapContainer, TileLayer, Marker, Popup, useMapEvent, useMapEvents } from "react-leaflet";
import L from "leaflet";

// import { Sheet, SheetCont, SheetHeader } from './ui/sheet';
import { AlertTriangle, ChevronDown, Wrench, CheckCircle2, X, Plus } from "lucide-react";
import styled from "styled-components";
import "leaflet/dist/leaflet.css";

const BottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: translateY(${(props) => (props.expanded ? "0" : "calc(100% - 0px)")});
  z-index: 2;
`;

// const BottomSheet = styled.div`
//         position: fixed;
//         bottom: 0;
//         left: 0;
//         right: 0;
//         background: white;
//         border-radius: 24px 24px 0 0;
//         box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
//         transition: transform 0.3s ease-in-out;
//         height: ${props => props.expanded ? '100vh' : 'auto'};
//         transform: translateY(${props => props.expanded ? '0' : 'calc(100% - 120px)'});
//         z-index: 2;
//     `;

const IssueTypes = {
  "Road & Traffic": "🚧",
  "Lighting & Utilities": "💡",
  "Sanitation & Waste": "🚮",
  "Public Safety & Security": <AlertTriangle size={20} />,
  "Water & Sewage": "💧",
  "Environment & Green Spaces": "🌳",
  "Noise & Nuisance": "🔇",
  "Animal & Wildlife": "🐾",
  "Signage & Street Furniture": "🪧",
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * The main map page component.
 *
 * This component renders a map with all issues currently reported.
 * It also renders a floating action button to create a new issue and a bottom sheet with issue details.
 *
 * @returns {JSX.Element}
 */
function MapPage() {
  const initPosition = [49.1871, -122.9241];

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [infoVis, setInfoVis] = useState(false);
  const [createVis, setCreateVis] = useState(false);
  const [phyPosition, setPhyPosition] = useState(null);
  const [mapCtx, setMapCtx] = useState(null);

  const [issues, setIssues] = useState([
    //template
    {
      id: 1,
      status: "In Progress",
      type: "Road & Traffic",
      title: "Pothole on Main St",
      description: "Large pothole causing traffic delays.",
      location: { y: 50.7128, x: -124.006 },
      date_created: "2025-05-01",
      vote_total: 432,
      user_voted: true,
    },
  ]);

  useEffect(() => {
    (async () => {
      let issues = await fetch("/api/issues/");
      // fetch("/api/issues/").then((res) => res.json()).then((data) => {
      //   console.log(2, data);});
      // console.log(a);
      if (issues.ok) {
        let issues_json = await issues.json();
        console.log(issues_json);
        setIssues(issues_json);
      } else {
        console.log("fetch issues failed");
      }
    })();
  }, []);

  const onMarkerClick = (issue) => {
    setSelectedIssue(issue);
    setInfoVis(true);
  };

  const toggleOverlay = () => {
    setInfoVis(false);
    setSelectedIssue(null);
  };

  const onLoacte = () => {
    let r = mapCtx?.locate();

    setPhyPosition(r._lastCenter);

    console.log(r);
  };

  const FloatingActionButton = () => (
    <button
      onClick={() => {
        setInfoVis(true);
        setCreateVis(true);
      }}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white text-orange-300
                       flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors
                       z-10">
      <Plus size={24} />
    </button>
  );

  const handleVote = async () => {
    console.log(selectedIssue);

    if (selectedIssue.user_voted) {
      // fetch(`/api/issues/vote/${selectedIssue.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     vote: -1,
      //   })
      // }).then(r => {
      //   if (!r.ok) {
      //     console.log("vote failed");
      //   }
      // });
    } else {
      fetch("/api/issues/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId: selectedIssue.id,
          vote: 1,
        }),
      }).then((r) => {
        if (!r.ok) {
          console.log("vote failed");
        }
      });
    }

    setSelectedIssue({
      ...selectedIssue,
      vote_total: selectedIssue.user_voted
        ? Number(selectedIssue.vote_total) - 1
        : Number(selectedIssue.vote_total) + 1,
      user_voted: !selectedIssue.user_voted,
    });

    const updatedIssues = issues.map((issue) => {
      if (issue.id === selectedIssue.id) {
        return {
          ...issue,
          vote_total: issue.user_voted ? issue.vote_total - 1 : issue.vote_total + 1,
          user_voted: !issue.user_voted,
        };
      }
      return issue;
    });
    console.log(selectedIssue, updatedIssues);
    setIssues(updatedIssues);
  };

  const Phylocation = () => {
    const [position, setPosition] = useState(null);
    let thisMapCtx = useMapEvents({
      locationfound(e) {
        setPosition(e.latlng);
        mapCtx.flyTo(e.latlng, mapCtx.getZoom());
      },
    });

    setMapCtx(thisMapCtx);

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  const CreateIssue = ({ location }) => {
    const [formData, setFormData] = useState({
      type: "",
      title: "",
      description: "",
      y: location?.lat || "",
      x: location?.lng || "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log(formData);
        const response = await fetch("/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
          }),
        });
        if (response.ok) {
          setInfoVis(false);
          setCreateVis(false);
        }
        // console.log(formData);
        // setInfoVis(false);
        // setCreateVis(false);
      } catch (error) {
        console.error("Error creating issue:", error);
      }
    };

    const handleCancel = () => {
      setInfoVis(false);
      setCreateVis(false);
    };

    return (
      <div className="p-4 h-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Report New Issue</h2>
          <button onClick={() => handleCancel()} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 h-[calc(100%-60px)]">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded"
              required>
              <option value="">Select type</option>
              {Object.entries(IssueTypes).map(([k, v]) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.y}
                onChange={(e) => setFormData({ ...formData, y: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.x}
                onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Submit Report
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />
      <div className="relative top-12 h-screen w-screen flex flex-col">
        <MapContainer
          center={initPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="flex-grow z-0">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Phylocation />

          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.location.y, issue.location.x]}
              eventHandlers={{
                click: () => onMarkerClick(issue),
              }}
            />
          ))}
        </MapContainer>

        {!infoVis && !selectedIssue && <FloatingActionButton />}

        <button
          className="absolute right-3 top-3 bg-orange-200 text-white font-bold py-2 px-4 border-b-4 border-orange-500 rounded"
          onClick={() => onLoacte()}
          style={{ zIndex: 400 }}>
          locate
        </button>

        <BottomSheet expanded={infoVis || createVis}>
          {createVis ? (
            <CreateIssue location={phyPosition} />
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {selectedIssue?.status === "In Progress" && (
                    <Wrench className="text-yellow-600" />
                  )}
                  {selectedIssue?.status === "Resolved" && (
                    <CheckCircle2 className="text-green-600" />
                  )}
                  <h2 className="text-xl font-bold">{selectedIssue?.title}</h2>
                </div>
                <button
                  onClick={() => toggleOverlay()}
                  className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {selectedIssue && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm w-full">
                    <span className="font-medium">Type:</span>
                    <span className="flex items-center gap-1">
                      {IssueTypes[selectedIssue.type]}
                      {selectedIssue.type}
                    </span>
                    <button
                      className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded float-right ${
                        selectedIssue.user_voted
                          ? "border bg-orange-300 text-white"
                          : "border border-orange-300 text-orange-300"
                      }`}
                      onClick={() => handleVote()}
                      aria-pressed={selectedIssue.user_voted}>
                      {selectedIssue.user_voted ? "Voted: " : "Up Vote: "}{" "}
                      {selectedIssue.vote_total || 0}
                    </button>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium mb-1">Description:</p>
                    <p className="text-gray-600">{selectedIssue.description}</p>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>
                      Reported: {new Date(selectedIssue.date_created).toLocaleDateString()}
                    </span>
                    <span>Status: {selectedIssue.status}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </BottomSheet>
      </div>
    </div>
  );
}

export default MapPage;
