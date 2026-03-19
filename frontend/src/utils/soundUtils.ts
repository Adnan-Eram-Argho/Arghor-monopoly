const audioCtx = new window.AudioContext();
let isMuted = false;

export const setMuted = (muted: boolean) => {
  isMuted = muted;
};



export const playPop = () => {
  if (isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

export const playDiceRoll = () => {
  if (isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  let time = audioCtx.currentTime;
  for (let i = 0; i < 6; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, time);
    
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(time);
    osc.stop(time + 0.05);
    time += Math.random() * 0.1 + 0.05;
  }
};

export const playCash = () => {
  if (isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const time = audioCtx.currentTime;

  const playNote = (freq: number, offset: number) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time + offset);
    gain.gain.setValueAtTime(0.15, time + offset);
    gain.gain.exponentialRampToValueAtTime(0.01, time + offset + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time + offset);
    osc.stop(time + offset + 0.3);
  };

  playNote(523.25, 0); // C5
  playNote(659.25, 0.1); // E5
  playNote(783.99, 0.2); // G5
  playNote(1046.50, 0.3); // C6
};

export const playNegative = () => {
  if (isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
};

export const playTurnStart = () => {
    if (isMuted) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const time = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, time); // A5
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(time);
    osc.stop(time + 0.6);
};
