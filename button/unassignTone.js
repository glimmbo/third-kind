// before:
// [ 'v7ic_Kw0IpgwoWxuAAAA',
//   '4FScCeqefL-2pE2gAAAB',
//   'mJuQDb4pCXWTdRwTAAAC' ]

// after: (connectedClients)
// let a = [ 'v7ic_Kw0IpgwoWxuAAAA', '4FScCeqefL-2pE2gAAAB' ];

// so change to match (tonesArray)
// let b = [
//   { name: 'G', socket: 'v7ic_Kw0IpgwoWxuAAAA' },
//   { name: 'A', socket: null },
//   { name: 'hiF', socket: '4FScCeqefL-2pE2gAAAB' },
//   { name: 'loF', socket: 'mJuQDb4pCXWTdRwTAAAC' },
//   { name: 'C', socket: null }
// ];


function unassignTone(connectedClients, tonesArray) {
  tonesArray.forEach(tone => {
    if (tone.socket) {
      if (!connectedClients.includes(tone.socket)) {
        tone.socket = null;
      }
    }
  });
  return tonesArray;
}

// console.log(unassignTone(a, b));

module.exports = unassignTone;
