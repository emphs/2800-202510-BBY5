import { useState, useEffect } from "react";

async function MyIssues() {
  const [issues, setIssues] = useState([]);
  //   try {
  //     const response = await fetch("/issues");
  //     const issues = await response.json();
  //   } catch (error) {
  //     console.error("Error fetching user issues", error);
  //     return;
  //   }

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.id}>
            <td>{issue.title}</td>
            <td>{issue.type}</td>
            <td>{issue.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
