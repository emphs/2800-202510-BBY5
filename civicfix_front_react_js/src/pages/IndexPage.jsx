import { useNavigate, Link } from '@tanstack/react-router';
import Footer from '../components/Footer';

function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <main
        className="flex-grow-1 d-flex align-items-center justify-content-center"
        style={{
          minHeight: '80vh',
          paddingTop: '80px',
          paddingBottom: '40px',
          background: '#D5F5E3',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          className="container-fluid d-flex flex-column align-items-center justify-content-center"
          style={{
            width: '100%',
            padding: '0 4vw',
          }}
        >
          <img
            src="/logos/civicfix_logo2.png"
            alt="CivicFix Logo"
            style={{
              width: 'min(60vw, 220px)',
              maxWidth: '100%',
              height: 'auto',
              marginBottom: '2vh',
            }}
            className="mb-3"
          />
          <h1
            className="fw-bold text-center mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', lineHeight: 1.1 }}
          >
            Welcome to CivicFix
          </h1>
          <p
            className="text-center mb-4"
            style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', maxWidth: '100vw' }}
          >
            Report, track, and resolve civic issues in your community. Join us in making your city a better place!
          </p>
          <div className="d-flex flex-column gap-3 w-100 justify-content-center align-items-center mb-4">
            <button
              className="btn btn-success btn-lg w-100"
              style={{
                maxWidth: '500px',
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                padding: '1em 0'
              }}
              onClick={() => navigate({ to: '/login' })}
            >
              Log In
            </button>
            <button
              className="btn btn-outline-success btn-lg w-100"
              style={{
                maxWidth: '500px',
                background: '#f6fefa',
                borderColor: '#27ae60',
                color: '#27ae60',
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                padding: '1em 0'
              }}
              onClick={() => navigate({ to: '/signup' })}
            >
              Sign Up
            </button>
          </div>
          <div className="text-center mt-2" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' }}>
            <span className="text-muted">Or continue as a guest</span>
            <br />
            <Link
              to="/map"
              className="btn btn-link p-0"
              style={{ fontSize: 'inherit' }}
            >
              View Map
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default IndexPage;
