import React, { useState } from 'react';

function DreamDecoder() {
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);

  const interpretDream = async () => {
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
      <h2>🔮 The Dream Oracle</h2>
      <p style={{ fontStyle: 'italic', color: 'white', opacity: 0.7 }}>
        <span style={{ fontSize: '1.1rem' }}>“What does this dream mean?”</span><br />
        Whisper your vision... and name it like a tale passed in twilight.
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
          <h3 style={{ color: '#ccc' }}>📜 Oracle's Whisper:</h3>
          <p style={{ fontStyle: 'italic' }}>{interpretation}</p>
        </div>
      )}
    </div>
  );
}

export default DreamDecoder;
