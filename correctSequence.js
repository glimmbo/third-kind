function correctSequence(tonesArray, activeSequence) {
  // if (tonesArray.length === activeSequence.length) {
    let match = true;
    for (let index = 0; index < activeSequence.length; index++) {
      if (activeSequence[index] != tonesArray[index].tone) {
        match = false;
        break;
      }
    }
    return match ? true : false;
  // }
}

module.exports = correctSequence