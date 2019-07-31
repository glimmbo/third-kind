//register the sw (sw.js)


//install event triggers:
//sw becomes active, caches resoources
self.addEventListener('install', e => {
  console.log('sw installed');
})

//if already installed (registered):


//active event triggers:
//sw 'listens' for events

self.addEventListener('activate', e => {
  console.log('sw active');
})

self.addEventListener('fetch', e => {
  console.log('fetch event', e)
})