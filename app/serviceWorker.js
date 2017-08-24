'use strict';

//Cache polyfil to support cacheAPI in all browsers
//importScripts('');
//var worker = new Worker('./cache-polyfill.js');

var cacheName = 'cache-v094';

//Files to save in cache
var files = [
  './',
  './index.html',
  './index.html?utm=homescreen', //SW treats query string as new page
  './css/style.css',
  './css/materialize.css',
   './css/blockly-demo.css',
  'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,700', //caching 3rd party content
  'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', //caching 3rd party content
  'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', //caching 3rd party content
  'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', //caching 3rd party content
  './images/icons/android-chrome-192x192.png',
  './blockly_compressed.js',
  './blocks_compressed.js',
  './python_compressed.js',
  './python_more.js',
    './msg/js/en.js',
      './js/storage.js',
        './python_more.js',

    './js/ace/ace.js',
      './js/materialize.js',
  './js/admin.js',
  './js/pages/ui/range-sliders.js',
  './js/pages/charts/jquery-knob.js',
  './js/pages/cards/colored.js',
  './js/pages/ui/notifications.js',   
  './js/reconnecting-websocket.js',   
  './js/term.js',   
  './js/monitor.js',   
  './js/manager.js',   
  './js/system.js',   
  './js/prompt.js', 
  './images/user-img-background.png',  
  './images/user.jpg',
  './images/icons/favicon-16x16.png',
  './images/icons/favicon-32x32.png',
  './js/app.js',
  './js/offline.js',
  './js/push.js',
  './js/sync.js',
  './js/toast.js',
  './js/share.js',
  './js/menu.js',
  './manifest.json'
];

//Adding `install` event listener
self.addEventListener('install', function (event) {
  console.info('Event: Install');

  event.waitUntil(
    caches.open(cacheName)
    .then(function (cache) {
      //[] of files to cache & if any of the file not present `addAll` will fail
      return cache.addAll(files)
      .then(function () {
        console.info('All files are cached');
        return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
      })
      .catch(function (error) {
        console.error('Failed to cache', error);
      })
    })
  );
});

/*
  FETCH EVENT: triggered for every request made by index page, after install.
*/

//Adding `fetch` event listener
self.addEventListener('fetch', function (event) {
  console.info('Event: Fetch');

  var request = event.request;

  //Tell the browser to wait for newtwork request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then(function(response) {
      if (response) {
        return response;
      }

      //if request is not cached, add it to cache
      return fetch(request).then(function(response) {
        var responseToCache = response.clone();
        caches.open(cacheName).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              console.warn(request.url + ': ' + err.message);
            });
          });

        return response;
      });
    })
  );
});

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener('activate', function (event) {
  console.info('Event: Activate');

  //Remove old and unwanted caches
  event.waitUntil( 
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== cacheName) {     //cacheName = 'cache-v094'
            return caches.delete(cache); //Deleting the cache
          }
        })
      );
    })
  );
});

/*
  PUSH EVENT: triggered everytime, when a push notification is received.
*/


/*
  BACKGROUND SYNC EVENT: triggers after `bg sync` registration and page has network connection.
  It will try and fetch github username, if its fulfills then sync is complete. If it fails,
  another sync is scheduled to retry (will will also waits for network connection)
*/

self.addEventListener('sync', function(event) {
  console.info('Event: Sync');

  //Check registered sync name or emulated sync from devTools
  if (event.tag === 'github' || event.tag === 'test-tag-from-devtools') {
    event.waitUntil(
      //To check all opened tabs and send postMessage to those tabs
      self.clients.matchAll().then(function (all) {
        return all.map(function (client) {
          return client.postMessage('online'); //To make fetch request, check app.js - line no: 122
        })
      })
      .catch(function (error) {
        console.error(error);
      })
    );
  }
});

/*
  NOTIFICATION EVENT: triggered when user click the notification.
*/
