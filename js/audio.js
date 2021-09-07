actx = new (window.AudioContext || window.webkitAudioContext)()
let oscillator = actx.createOscillator()
let gainNode = actx.createGain()
oscillator.connect(gainNode)
gainNode.connect(actx.destination)

gainNode.gain.value = 0.1
oscillator.type = "triangle"

const beep = function (freq) {
	oscillator.frequency.value = freq
	oscillator.start()
	oscillator.stop(actx.currentTime + 2)
	return "sure bub"
}
