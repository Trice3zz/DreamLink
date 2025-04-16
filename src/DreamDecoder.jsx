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
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a poetic dream oracle. Interpret dreams with surreal, symbolic wisdom in a mysterious and comforting tone.',
            },
            {
              role: 'user',
              content: `Title: ${title}\nDream: ${input}\nWhat does this dream reveal beneath the surface?`,
            },
          ],
          temperature: 0.85,
        }),
      });

      const data = await response.json();
      console.log(data); // for debugging

      if (data.choices && data.choices.length > 0) {
        setInterpretation(data.choices[0].message.content.trim());
      } else {
        setInterpretation('🌀 The oracle is silent. Try again soon.');
      }
    } catch (err) {
      console.error('Dream Oracle error:', err);
      setInterpretation('🌑 Something went wrong while interpreting your dream. Try again soon.');
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
          <p style={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{interpretation}</p>
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
console.log("API KEY LOADED:", import.meta.env.VITE_OPENAI_API_KEY);

export default DreamDecoder;
