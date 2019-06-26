// let tones = [
//   { name: "G", taken: false },
//   { name: "A", taken: false },
//   { name: "hiF", taken: false },
//   { name: "loF", taken: false },
//   { name: "C", taken: false },
// ];

// works, but still need to limit connections to 5
const randomFreeTone = (tonesArray, socketId) => {
  let tone = tonesArray[Math.floor(Math.random() * tonesArray.length)];
  if (tone.socket) {
    console.log(tone.name + " taken, re-running");
    return randomFreeTone(tonesArray, socketId);
  } else {
    tone.socket = socketId;
    console.log("assigned tone " + tone.name + " to " + socketId);
    return tone;
  }
};

// randomFreeTone(tones, 'user1');
// randomFreeTone(tones, 'user2');
// randomFreeTone(tones, 'user3');
// randomFreeTone(tones, 'user4');
// randomFreeTone(tones, 'user5');



module.exports = randomFreeTone;
