
import React, { useState } from 'react';

function CreativeMode() {
  const [dream, setDream] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const createStory = async () => {
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
            { role: 'system', content: 'You are a magical creative writer that turns dreams into poetic or mystical short stories.' },
            { role: 'user', content: `Write a short surreal story inspired by this dream: ${dream}` },
          ],
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      setStory(data.choices[0].message.content.trim());
    } catch (error) {
      setStory('Error generating story. Try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="component">
      <h2>Creative Mode</h2>
      <textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Enter a dream and turn it into a story..."
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={createStory}>Create Story</button>
      {loading ? <p>Generating...</p> : <p><strong>{story}</strong></p>}
    </div>
  );
}

export default CreativeMode;
