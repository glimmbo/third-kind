// let tones = [
//   { tone: "G", socket: null },
//   { tone: "A", socket: null },
//   { tone: "hiF", socket: null },
//   { tone: "loF", socket: null },
//   { tone: "C", socket: null },
// ];

const randomFreeTone = (tonesArray, socketId) => {
  let remaining = tonesArray.filter(tone => !tone.socket);
  let tone = remaining[Math.floor(Math.random() * remaining.length)];
  tone.socket = socketId;
  console.log("assigned tone " + tone.tone + " to " + socketId);
  return tone;
};

// randomFreeTone(tones, 'user1');
// randomFreeTone(tones, 'user2');
// randomFreeTone(tones, 'user3');
// randomFreeTone(tones, 'user4');
// randomFreeTone(tones, 'user5');

module.exports = randomFreeTone;
