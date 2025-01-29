'use client'; 
import { socialLogin } from '@/app/actions';
import React from 'react';

const LoginForm = () => {
  return (
    <form action={socialLogin} style={{ maxWidth: '400px', margin: '0 auto', padding: '30px', boxSizing: 'border-box' }}>
      <button 
        type="submit" 
        name="action" 
        value="google" 
        style={{
          width: '100%',
          maxWidth: '350px',
          padding: '12px 18px',  // Adjusted padding for a sleeker look
          margin: '10px 0',
          border: 'none',
          borderRadius: '6px', // Less rounded, more sleek
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '14px',
          background: 'linear-gradient(145deg, #db4437, #c1351d)',  // Gradient for depth
          color: 'white',
          textTransform: 'uppercase',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',  // Soft shadow for depth
          fontFamily: "'Roboto', sans-serif",
          letterSpacing: '1px',
          position: 'relative',
        }}
        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #c1351d, #db4437)'} // Change gradient on hover
        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #db4437, #c1351d)'}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
          alt="Google logo"
          style={{
            width: '24px', 
            height: '24px', 
            objectFit: 'contain',
            transition: 'transform 0.3s ease', // Smooth scaling on hover
          }}
        />
        <span>Sign In With Google</span>
      </button>

      <button 
        type="submit" 
        name="action" 
        value="github" 
        style={{
          width: '100%',
          maxWidth: '350px',
          padding: '12px 18px',  // Adjusted padding for a sleeker look
          margin: '10px 0',
          border: 'none',
          borderRadius: '6px', // Less rounded, more sleek
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '14px',
          background: 'linear-gradient(145deg, #333, #444)', // Gradient for depth
          color: 'white',
          textTransform: 'uppercase',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',  // Soft shadow for depth
          fontFamily: "'Roboto', sans-serif",
          letterSpacing: '1px',
          position: 'relative',
        }}
        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(145deg, #444, #333)'} // Change gradient on hover
        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(145deg, #333, #444)'}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt="GitHub logo"
          style={{
            width: '24px', 
            height: '24px', 
            objectFit: 'contain',
            transition: 'transform 0.3s ease', // Smooth scaling on hover
          }}
        />
        <span>Sign In With GitHub</span>
      </button>
    </form>
  );
};

export default LoginForm;
