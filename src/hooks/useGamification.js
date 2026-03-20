import { useMemo, useEffect, useState } from 'react';

export const triggerConfetti = async () => {
  try {
    const confetti = (await import('canvas-confetti')).default;
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } catch (err) {
    // CSS-ONLY FALLBACK CELEBRATION
    console.warn("Confetti package not yet loaded/installed. Using CSS fallback...");
    const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 3 + 's';
      piece.style.width = Math.random() * 10 + 5 + 'px';
      piece.style.height = piece.style.width;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 6000);
    }
  }
};

export const BADGE_DEFINITIONS = [
  { id: 'first_session', title: 'First Steps', description: 'Complete your first session', icon: '🌟' },
  { id: 'streak_3', title: '3-Day Streak', description: 'Practice 3 days in a row', icon: '🔥' },
  { id: 'streak_7', title: '7-Day Streak', description: 'Practice 7 days in a row', icon: '🚀' },
  { id: 'sessions_10', title: 'Dedicated Learner', description: 'Complete 10 sessions', icon: '📚' },
  { id: 'sessions_50', title: 'Half Century', description: 'Complete 50 sessions', icon: '🏅' },
  { id: 'sessions_100', title: 'Century Milestone', description: 'Complete 100 sessions', icon: '👑' },
  { id: 'master_aa', title: 'Master of आ', description: 'Hold sound आ for 10+ seconds', icon: '🗣️' },
];

export const useGamification = (records, stats) => {
  const [hasCelebratedLevel, setHasCelebratedLevel] = useState(null);
  const [hasCelebratedBadges, setHasCelebratedBadges] = useState(null);

  const gamificationStats = useMemo(() => {
    if (!records) return { xp: 0, level: 1, progress: 0, badges: [], unearnedBadges: [], dailyChallenge: { progress: 0, isComplete: false } };

    const soundRecords = records.sounds || [];
    const varnmalaRecords = records.varnmala || [];
    const storyRecords = records.stories || [];
    const totalSessions = soundRecords.length + varnmalaRecords.length + storyRecords.length;

    // --- Calculate XP ---
    const xpFromSounds = soundRecords.length * 10;
    const xpFromVarnmala = varnmalaRecords.length * 20;
    const xpFromStories = storyRecords.length * 30;
    const totalXP = xpFromSounds + xpFromVarnmala + xpFromStories;

    // --- Calculate Level ---
    // Simple math: Level 1 starts at 0, Level 2 at 100, Level 3 at 250, etc.
    const getLevelForXP = (xp) => {
      let level = 1;
      let threshold = 100;
      let currentXp = xp;
      while (currentXp >= threshold) {
        currentXp -= threshold;
        level++;
        threshold = Math.floor(threshold * 1.5); // XP required increases by 50% each level
      }
      return { level, currentXp, xpToNext: threshold, progress: Math.min((currentXp / threshold) * 100, 100) };
    };

    const levelInfo = getLevelForXP(totalXP);

    // --- Calculate Badges ---
    const earnedBadges = [];
    
    if (totalSessions >= 1) earnedBadges.push('first_session');
    if (totalSessions >= 10) earnedBadges.push('sessions_10');
    if (totalSessions >= 50) earnedBadges.push('sessions_50');
    if (totalSessions >= 100) earnedBadges.push('sessions_100');
    
    if (stats?.streak >= 3) earnedBadges.push('streak_3');
    if (stats?.streak >= 7) earnedBadges.push('streak_7');
    
    const hasMasteredAa = soundRecords.some(r => r.sound === 'आ' && r.time >= 100); // 100 deciseconds = 10s
    if (hasMasteredAa) earnedBadges.push('master_aa');

    // Populate full badge objects
    const mappedBadges = BADGE_DEFINITIONS.filter(b => earnedBadges.includes(b.id));

    // --- Daily Challenge ---
    // Example: Hold sum of 'अ' for at least 50 deciseconds today
    const today = new Date().toDateString();
    const todaySoundRecords = soundRecords.filter(r => new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toDateString() === today);
    const todayAaSumTime = todaySoundRecords.filter(r => r.sound === 'अ').reduce((acc, curr) => acc + curr.time, 0);
    const target = 50; // 5 seconds cumulative
    
    const dailyChallenge = {
      title: "Daily Goal: Practice 'अ'",
      description: "Hold the sound 'अ' for a total of 5 seconds today.",
      progress: Math.min((todayAaSumTime / target) * 100, 100),
      isComplete: todayAaSumTime >= target
    };

    return {
      xp: totalXP,
      level: levelInfo.level,
      progress: levelInfo.progress,
      xpToNext: levelInfo.xpToNext,
      currentXp: levelInfo.currentXp,
      badges: mappedBadges,
      unearnedBadges: BADGE_DEFINITIONS.filter(b => !earnedBadges.includes(b.id)),
      dailyChallenge
    };
  }, [records, stats]);

  useEffect(() => {
    // Only celebrate if we're not on initial load (i.e. we went from Level 1 to Level 2 in a session)
    if (hasCelebratedLevel === null) {
      setHasCelebratedLevel(gamificationStats.level);
    } else if (gamificationStats.level > hasCelebratedLevel) {
      triggerConfetti();
      setHasCelebratedLevel(gamificationStats.level);
    }

    if (hasCelebratedBadges === null) {
      setHasCelebratedBadges(gamificationStats.badges.length);
    } else if (gamificationStats.badges.length > hasCelebratedBadges) {
      triggerConfetti();
      setHasCelebratedBadges(gamificationStats.badges.length);
    }
  }, [gamificationStats.level, gamificationStats.badges.length]);

  return gamificationStats;
};
