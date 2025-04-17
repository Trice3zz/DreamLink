import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DreamJournal from './DreamJournal.jsx';
import DreamDecoder from './DreamDecoder.jsx';
import DreamSync from './DreamSync.jsx';
import CreativeMode from './CreativeMode.jsx';
import LucidTrainer from './LucidTrainer.jsx';
import DreamFeed from './DreamFeed.jsx';
import LucidDashboard from './LucidDashboard.jsx';
import Navbar from './Navbar.jsx';
import './App.css';

function App() {
  const [theme, setTheme] = useState('night');

  useEffect(() => {
    const hour = new Date().getHours();
    setTheme(hour >= 6 && hour < 18 ? 'day' : 'night');
  }, []);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'star-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = -1;
    canvas.style.pointerEvents = 'none';
    canvas.style.backgroundImage = "url('https://images.unsplash.com/photo-1603481546579-6b17b7d5b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')";
    canvas.style.backgroundSize = 'cover';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStar = null;
    let mouse = { x: 0, y: 0 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          colorShift: Math.random()
        });
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let s of stars) {
        s.opacity += s.speed;
        if (s.opacity >= 1 || s.opacity <= 0) s.speed = -s.speed;
        const hue = (Date.now() / 50 + s.colorShift * 360) % 360;
        ctx.beginPath();
        ctx.arc(
          s.x + (mouse.x - canvas.width / 2) * 0.001,
          s.y + (mouse.y - canvas.height / 2) * 0.001,
          s.r,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `hsla(${hue}, 100%, 75%, ${s.opacity})`;
        ctx.fill();
      }

      if (shootingStar) {
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x + shootingStar.length, shootingStar.y + shootingStar.length / 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
        shootingStar.x += 20;
        shootingStar.y += 10;
        if (shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
          shootingStar = null;
        }
      }

      requestAnimationFrame(drawStars);
    }

    function triggerShootingStar() {
      shootingStar = {
        x: Math.random() * canvas.width / 2,
        y: Math.random() * canvas.height / 2,
        length: Math.random() * 100 + 100
      };
    }

    resize();
    createStars(200);
    drawStars();

    window.addEventListener('resize', () => {
      resize();
      createStars(200);
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const shootingInterval = setInterval(triggerShootingStar, 12000);

    // Floating thoughts
    const thoughts = [
      "I was flying through clouds...",
      "Everything shimmered like silver rain.",
      "There was a voice, but no one there.",
      "I opened a door to nowhere.",
      "It was more than a dream..."
    ];

    function spawnThought() {
      const bubble = document.createElement('div');
      bubble.innerText = thoughts[Math.floor(Math.random() * thoughts.length)];
      bubble.className = 'thought-bubble';
      bubble.style.left = Math.random() * 90 + '%';
      document.body.appendChild(bubble);

      setTimeout(() => {
        document.body.removeChild(bubble);
      }, 8000);
    }

    const bubbleInterval = setInterval(spawnThought, 10000);

    const audio = new Audio('https://www.youtube.com/watch?v=LFASWuckB1c');
    audio.loop = true;

    function startMusic() {
      audio.play().catch(() => {});
      window.removeEventListener('click', startMusic);
    }

    window.addEventListener('click', startMusic);

    return () => {
      document.body.removeChild(canvas);
      clearInterval(shootingInterval);
      clearInterval(bubbleInterval);
      window.removeEventListener('click', startMusic);
      window.removeEventListener('mousemove', () => {});
    };
  }, []);

  // Home page content
  const Home = () => (
    <>
      <h1 className="title">☁️ Dream Link</h1>
      <p style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.8 }}>
        Where your midnight visions float and find each other ✨
      </p>
      <DreamJournal />
      <DreamDecoder />
      <DreamSync />
      <CreativeMode />
      <LucidTrainer />
    </>
  );

  return (
    <Router>
      <Navbar />
      <img
    src="/dreamlink logo.png"
    alt="Dream Link Logo"
    className="dream-logo"
  />
      <div className={`app-container ${theme}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<DreamFeed />} />
          <Route path="/lucid" element={<LucidDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
