// Web Audio API & Vibration Sound Engine for Gym Timer & Celebrations

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function playCountdownBeep(isFinal: boolean = false) {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    // 600Hz for 3,2,1 and 1200Hz for 0 / Time Up!
    osc.frequency.setValueAtTime(isFinal ? 1200 : 650, ctx.currentTime)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.6 : 0.2))

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + (isFinal ? 0.6 : 0.2))

    // Haptic vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (isFinal) {
        navigator.vibrate([120, 80, 200, 80, 300])
      } else {
        navigator.vibrate(60)
      }
    }
  } catch (err) {
    console.warn('Audio playback error:', err)
  }
}

export function playSuccessChime() {
  try {
    const ctx = getAudioContext()
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08)

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + idx * 0.08)
      osc.stop(ctx.currentTime + idx * 0.08 + 0.45)
    })

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200])
    }
  } catch (err) {
    console.warn('Success chime error:', err)
  }
}
