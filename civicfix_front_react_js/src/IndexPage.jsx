import { useNavigate } from '@tanstack/react-router';

function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1>Welcome to CivicFix</h1>
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate({ to: '/login' })}
      >
        Sign In
      </button>
    </div>
  );
}

export default IndexPage;
