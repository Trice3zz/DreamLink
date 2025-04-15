
import React, { useState } from 'react';

function DreamSync() {
  const [syncedDreams] = useState([
    "I was flying above a glowing ocean.",
    "I saw a tiger with wings in a neon jungle.",
    "I kept walking through endless doors..."
  ]);

  return (
    <div className="component">
      <h2>Dream Sync</h2>
      <p>People dreaming like you right now:</p>
      <ul>
        {syncedDreams.map((dream, index) => (
          <li key={index}>{dream}</li>
        ))}
      </ul>
    </div>
  );
}

export default DreamSync;
