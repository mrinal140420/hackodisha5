import Dashboard from '../features/reports/Dashboard.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuth } from '../features/auth/useAuth.js';
import { useState } from 'react';

export default function AuthorityHome() {
  // use ProtectedRoute to ensure only authority can access
  const auth = useAuth();
  const [sig, setSig] = useState(0);

  // If the app-level useAuth returned role outside Authority, ProtectedRoute will redirect.
  return (
    <ProtectedRoute roles={['authority']}>
      <div>
        <h1>Authority Panel</h1>
        <p>Welcome, {auth.name || 'Authority'}. Use this panel to manage reports.</p>

        {/* Dashboard can accept a signal if you want to force refresh */}
        <Dashboard refreshSignal={sig} />

        <div style={{ marginTop: 12 }}>
          <button onClick={() => setSig(s => s + 1)}>Refresh</button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
