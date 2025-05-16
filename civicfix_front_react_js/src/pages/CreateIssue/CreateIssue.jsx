import { useRef, useState } from "react";
import "./CreateIssue.css";

export default function CreateIssue() {
  const [description, setDescription] = useState("");

  const titleRef = useRef();

  async function getDescription() {
    const response = await fetch(
      `/issues/gen-description?title=${encodeURIComponent(titleRef.current.value)}`
    );
    console.log("response", response);

    setDescription((await response.json()).description);
  }

  return (
    <div id="container">
      <button onClick={getDescription}>Generate Description</button>
      <input type="text" ref={titleRef} placeholder="Issue Title" />
      <textarea
        type="text"
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
}
