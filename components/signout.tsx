'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

const SignOutButton = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: '/', 
    });
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        width: '100%',
        maxWidth: '350px',
        padding: '12px 18px',
        margin: '10px 0',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: '#f44336',
        color: 'white',
        textTransform: 'uppercase',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
