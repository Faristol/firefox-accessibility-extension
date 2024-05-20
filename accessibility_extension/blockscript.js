import { site } from "./blocklist.js";
browser.webRequest.onBeforeRequest.addListener(
  function (details) {   
    return { cancel: true};
  },
  { urls: site },
  ["blocking"]
);


