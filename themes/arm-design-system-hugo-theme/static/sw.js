self.addEventListener("install", event => {
   console.log("LP service worker installed");
});

self.addEventListener("activate", event => {
   console.log("LP service worker activated");
});


