import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';
import CloudPopup from './CloudPopup';

function DreamJournal() {
  const [dream, setDream] = useState('');
  const [savedDreams, setSavedDreams] = useState([]);
  const [filteredDreams, setFilteredDreams] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useUser();

  // Fetch dreams on load
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'dreams'),
      where('email', '==', user.email),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dreams = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedDreams(dreams);
      setFilteredDreams(dreams);
    });

    return () => unsubscribe();
  }, [user]);

  // Filter by text & date
  useEffect(() => {
    let filtered = savedDreams;

    if (search) {
      filtered = filtered.filter(d =>
        d.dream.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(d => {
        const dreamDate = new Date(d.timestamp?.seconds * 1000)
          .toISOString()
          .split('T')[0];
        return dreamDate === selectedDate;
      });
    }

    setFilteredDreams(filtered);
  }, [search, selectedDate, savedDreams]);

  // Add dream
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

    setDream('');
  };

  // Delete dream
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'dreams', id));
  };

  // Edit dream
  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, 'dreams', id), { dream: editText });
    setEditId(null);
    setEditText('');
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

      {/* Search & Calendar Filters */}
      <div style={{ marginTop: '2rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search your dreams..."
          className="cloud-input"
        />
        <br />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="cloud-input"
          style={{ marginTop: '1rem' }}
        />
      </div>

      {/* Dream List */}
      {filteredDreams.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>🌫️ Your Past Visions:</h3>
          <ul>
            {filteredDreams.map((d) => (
              <li key={d.id} style={{ marginBottom: '1.5rem' }}>
                <strong>🕰 {new Date(d.timestamp?.seconds * 1000).toLocaleString()}</strong>
                <br />
                {editId === d.id ? (
                  <>
                    <textarea
                      rows="2"
                      className="cloud-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button className="cloud-button" onClick={() => handleEdit(d.id)}>Save</button>
                    <button className="cloud-button" onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <em>“{d.dream}”</em>
                    <br />
                    <button className="cloud-button" onClick={() => {
                      setEditId(d.id);
                      setEditText(d.dream);
                    }}>Edit</button>
                    <button className="cloud-button" onClick={() => handleDelete(d.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showPopup && (
        <CloudPopup
          message="☁️ Please log in or create an account to record your dreams."
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default DreamJournal;

