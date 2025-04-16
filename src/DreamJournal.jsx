import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useUser } from '../UserContext';
import CloudPopup from './CloudPopup';

function DreamJournal() {
  const [dream, setDream] = useState('');
  const [savedDreams, setSavedDreams] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dream.trim()) return;

    if (!user) {
      setShowPopup(true);
      return;
    }

    await addDoc(collection(db, 'dreams'), {
      dream,
      email: user.email,
      timestamp: new Date(),
    });
    setSavedDreams([...savedDreams, dream]);
    setDream('');
  };

  return (
    <div className="component">
      <h2>🌙 Dream Journal</h2>
      <textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Describe what you saw between the stars..."
        rows="4"
        cols="50"
        className="cloud-textarea"
      />
      <br />
      <button className="cloud-button" onClick={handleSubmit}>Capture This Dream</button>

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

      {showPopup && (
        <CloudPopup
          message="☁️ Please log in or create an account to save your dreams."
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default DreamJournal;

