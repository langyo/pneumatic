self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(self['skipWaiting']());
});

self.addEventListener('fetch', async (event: FetchEvent) => {
  const [_url, route, _query] =
    /https?\:\/\/([A-Za-z0-9\-\.]+)(\/[^\?\#]*)(.*)$/.exec(event.request.url);

  event.respondWith(
    (async () => {
      const cache = await caches.open('cache');

      try {
        // Try to download the latest file from the origin site.
        const response = await fetch(route, { cache: 'no-store' });
        await cache.delete(new Request(route));
        await cache.put(new Request(route), response.clone());
        return response;
      } catch (err) {
        // Try to search the cache.
        const response = await cache.match(event.request);
        if (response) {
          return response;
        }
        // Finally, the request could not be processed and an error was thrown.
        throw Error(`Can't fetch the source: '${event.request.url}'`);
      }
    })()
  );
});
