// let funcs = [];

// for (let i = 0; i < 3; i++) {
//   funcs[i] = function() {
//     console.log("My value: " + i);
//   };
// }

// funcs[0]();
// funcs[1]();
// funcs[2]();

////////////////

let tones = ["G", "A", "hiF", "loF", "C"];
let dupTones = ["G", "G","A", "A", "hiF" ];

function lightUp(tone) {
  let light = document.querySelector(`#${tone}`)
  light.classList.add('pressed');
  setTimeout(() => {
    light.classList.remove('pressed');
  }, 1000);
}


tones.forEach((tone, i) => {
  setTimeout(() => {
    lightUp(tone);
    console.log(i + 1)
  }, (1000 * (i + 1)));
})

for (let i = 0; i < tones.length; i++) {
  tones[i] = function() {
    setTimeout(() => {
      lightUp(tone);
    }, (1000 * (i + 1)));
  };
}