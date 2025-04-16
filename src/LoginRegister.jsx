import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="component">
      <h2>{isLogin ? '🌙 Login to Your Dreamscape' : '☁️ Create a Dream Link Account'}</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="cloud-input" />
      <br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="cloud-input" />
      <br />
      <button className="cloud-button" onClick={handleAuth}>{isLogin ? 'Enter the Realm' : 'Join the Dream'}</button>
      <br />
      <button onClick={() => setIsLogin(!isLogin)} className="cloud-button" style={{ marginTop: '1rem' }}>
        {isLogin ? 'Need to register?' : 'Already dreaming? Log in'}
      </button>
    </div>
  );
}

export default LoginRegister;
