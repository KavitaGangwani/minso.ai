'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { signInAction } from '@/lib/admin-actions';

// Admin sign in form matching reference design with robust client-side submission
export default function SignInForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('password', password);

    const res = await signInAction(null, formData);

    if (res && res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/admin/agents');
      router.refresh();
    }
  };

  return (
    <div className="login">
      <Logo size={30} />
      <h2>Admin sign in</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="pw" style={{ color: 'var(--mute)', fontSize: '14px' }}>
          Password (preview: type admin)
        </label>
        <input
          id="pw"
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="err" id="err">
          {error}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button className="btn" id="go" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <Link href="/" className="btn line">
            Back to site
          </Link>
        </div>
      </form>
    </div>
  );
}
