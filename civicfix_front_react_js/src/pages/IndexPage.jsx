import { useNavigate } from '@tanstack/react-router';
import Footer from '../components/Footer';

function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{height: '80vh', backgroundColor: '#D5F5E3'}}>
        <h1>Welcome to CivicFix</h1>
        <button
          className="btn btn-primary mt-3 mx-2"
          onClick={() => navigate({ to: '/login' })}
        >
          Sign In
        </button>
        <button
          className="btn btn-primary mt-3 mx-2"
          onClick={() => navigate({ to: '/signup' })}
        >
          Sign Up
        </button>
      </div>
          <Footer />
    </div>
  );
}

export default IndexPage;
