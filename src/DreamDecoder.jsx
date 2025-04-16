import React, { useState } from 'react';
import CloudPopup from './CloudPopup';
import { useUser } from './UserContext';

function DreamDecoder() {
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useUser();

  const interpretDream = async () => {
    if (!user) {
      setShowPopup(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a poetic dream oracle. Speak with mystery, warmth, and surreal insight. Interpret dreams like ancient scrolls of the soul.' },
            { role: 'user', content: `Title: ${title}\nDream: ${input}\nWhat does this dream reveal beneath the surface?` },
          ],
          temperature: 0.85,
        }),
      });

      const data = await response.json();
      setInterpretation(data.choices[0].message.content.trim());
    } catch (error) {
      setInterpretation('🌀 The winds of insight are momentarily still... try again.');
    }
    setLoading(false);
  };

  return (
    <div className="component">
      <h2 className="shimmer">🔮 The Dream Oracle</h2>
      <p className="shimmer" style={{ fontStyle: 'italic', opacity: 0.8 }}>
        “What does this dream mean?”<br />Whisper your vision... and name it like a tale passed in twilight.
      </p>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Name your dream..."
        className="cloud-input"
      />
      <br /><br />

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the vision that visited you..."
        rows="5"
        cols="50"
        className="cloud-textarea"
      />
      <br />
      <button className="cloud-button" onClick={interpretDream}>
        Reveal the Meaning
      </button>

      {loading && <p style={{ color: 'white' }}>🌙 Consulting the celestial archives...</p>}
      {interpretation && (
        <div style={{ marginTop: '1rem' }}>
          <h3 className="shimmer">📜 Oracle's Whisper:</h3>
          <p style={{ fontStyle: 'italic' }}>{interpretation}</p>
        </div>
      )}

      {showPopup && (
        <CloudPopup
          message="☁️ Please log in or create an account to receive your dream’s interpretation."
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default DreamDecoder;

