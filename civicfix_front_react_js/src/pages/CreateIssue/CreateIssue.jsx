import { useRef, useState } from "react";
import "./CreateIssue.css";
import { Sparkles } from "lucide-react";

/**
 * A React component that allows users to create an issue by entering a title
 * and generating a description using AI. The component provides an input
 * field for the issue title and a textarea for the description. A button
 * triggers the generation of the description based on the entered title.
 *
 * @component
 */

export default function CreateIssue() {
  const [description, setDescription] = useState("");

  const titleRef = useRef();

  /**
   * Fetches a generated description from the backend API based on the
   * current value of the title input field.
   *
   * @returns {Promise<void>}
   */
  async function getDescription() {
    const response = await fetch(
      `/api/issues/gen-description?title=${encodeURIComponent(titleRef.current.value)}`
    );
    console.log("response", response);

    setDescription((await response.json()).description);
  }

  return (
    <div id="container">
      <button onClick={getDescription}>
        Generate Description <Sparkles size={20} />
      </button>
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
