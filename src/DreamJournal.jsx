import React, { useState, useEffect } from 'react';
import { db, auth, provider } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function DreamJournal() {
  const [dream, setDream] = useState('');
  const [savedDreams, setSavedDreams] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => console.error(error));
  };

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dream.trim()) return;

    if (user) {
      await addDoc(collection(db, 'dreams'), {
        dream,
        email: user.email,
        timestamp: new Date(),
      });
      setSavedDreams([...savedDreams, dream]);
      setDream('');
    } else {
      alert("Float with us — sign in first to save your dream.");
    }
  };

  return (
    <div className="component">
      <h2>🌙 Dream Journal</h2>

      {user ? (
        <div>
          <p>Welcome back, dreamer <strong>{user.displayName}</strong> ☁️</p>
          <button className="cloud-button" onClick={handleLogout}>Drift Away (Logout)</button>
        </div>
      ) : (
        <button className="cloud-button" onClick={handleLogin}>Float In with Google</button>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Describe what you saw between the stars..."
          rows="4"
          cols="50"
        />
        <br />
        <button className="cloud-button" type="submit">Capture This Dream</button>
      </form>

      {savedDreams.length > 0 && (
        <div>
          <h3>🌫️ Glimpses You've Gathered:</h3>
          <ul>
            {savedDreams.map((d, i) => (
              <li key={i}>“{d}”</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DreamJournal;
