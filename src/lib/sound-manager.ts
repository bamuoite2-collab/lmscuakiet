// Sound Effects Manager
class SoundManager {
    private enabled: boolean = true;
    private volume: number = 0.5;

    constructor() {
        // Load preferences from localStorage
        const saved = localStorage.getItem('soundSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.enabled = settings.enabled ?? true;
            this.volume = settings.volume ?? 0.5;
        }
    }

    private saveSettings() {
        localStorage.setItem('soundSettings', JSON.stringify({
            enabled: this.enabled,
            volume: this.volume
        }));
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        this.saveSettings();
    }

    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    getEnabled() {
        return this.enabled;
    }

    getVolume() {
        return this.volume;
    }

    private play(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.enabled) return;

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.error('Sound playback error:', error);
        }
    }

    // XP Gain sound - short ding
    playXPGain() {
        this.play(800, 0.1, 'sine');
        setTimeout(() => this.play(1000, 0.1, 'sine'), 50);
    }

    // Level Up sound - triumphant fanfare
    playLevelUp() {
        const notes = [
            { freq: 523, time: 0 },     // C5
            { freq: 659, time: 0.15 },  // E5
            { freq: 784, time: 0.3 },   // G5
            { freq: 1047, time: 0.45 }  // C6
        ];

        notes.forEach(note => {
            setTimeout(() => this.play(note.freq, 0.2, 'square'), note.time * 1000);
        });
    }

    // Achievement sound - success chime
    playAchievement() {
        this.play(1047, 0.15, 'triangle');
        setTimeout(() => this.play(1319, 0.15, 'triangle'), 100);
        setTimeout(() => this.play(1568, 0.3, 'triangle'), 200);
    }

    // Quest Complete sound - gentle chime
    playQuestComplete() {
        this.play(880, 0.2, 'sine');
        setTimeout(() => this.play(1047, 0.3, 'sine'), 150);
    }

    // Error sound - low buzz
    playError() {
        this.play(200, 0.2, 'sawtooth');
    }

    // Success sound - pleasant ding
    playSuccess() {
        this.play(1000, 0.15, 'sine');
    }
}

// Export singleton instance
export const soundManager = new SoundManager();
