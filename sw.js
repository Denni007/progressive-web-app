importScripts('./analytics-helper.js');

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

workbox.googleAnalytics.initialize({
  // Set custom dimension in slot index 1 to a value of 'offline'
  parameterOverrides: {
    cd1: 'offline'
  },
  // Set custom metric in slot index 1 to qt/1000 (i.e. queued seconds)
  hitFilter: params => {
   const queueTimeInSeconds = Math.round(params.get('qt') / 1000)
   params.set('cm1', queueTimeInSeconds)
  }
});
const staticAssets = [
  './',
  './styles.css',
  './app.js',
  './fallback.json'
];



self.addEventListener('install', async event =>{
  const cache = await caches.open('news-static');
  await cache.addAll(staticAssets);
});

self.addEventListener('fetch', async e => {
  const req = e.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
      e.respondWith(cacheFirst(req));
    } else {
      console.log('hello');
      e.respondWith(networkFirst(req));
    }
});


async function cacheFirst(req) {
  const cache = await caches.open('news-dynamic');
  const cached = await cache.match(req);
  return cached || fetch(req);
}
 async function networkFirst(req){
    const cache = await caches.open('news-dynamic');
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse =  await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}

//
// async function networkAndCache(req) {
//   const cache = await caches.open('news-dynamic');
//   try {
//     const fresh = await fetch(req);
//     await cache.put(req, fresh.clone());
//     return fresh;
//   } catch (e) {
//     const cached = await cache.match(req);
//     return cached;
//   }
// }



self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  console.log('Closed notification: ' + primaryKey);
  // TODO Send notification close event
});

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  notification.close();
  e.waitUntil(
    Promise.all([
      clients.openWindow('pages/page' + primaryKey + '.html'),
      // TODO Send notification click event
      sendAnalyticsEvent('click', 'notification')
    ])
  );
});

self.addEventListener('push', function(e) {
  var options = {
    body: 'This notification was generated from a push!',
    icon: 'images/notification-flat.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '-push-notification'
    }
  };
  e.waitUntil(Promise.all([
      self.registration.showNotification('Hello world!', options),
      // TODO Send push recieved event
    ])
  );
});
