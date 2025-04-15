import React, { useEffect, useState } from 'react';
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

function DreamFeed() {
  const [dreams, setDreams] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "dreams"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setDreams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="component">
      <h2>Dream Feed</h2>
      {dreams.map((dream) => (
        <div key={dream.id} className="dream-entry">
          <p><strong>{dream.email}:</strong> {dream.dream}</p>
          <small>{new Date(dream.timestamp?.seconds * 1000).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default DreamFeed;
