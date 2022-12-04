import {RemixBrowser} from "@remix-run/react";
import {startTransition} from "react";
import {hydrateRoot} from "react-dom/client";
import {Settings} from "luxon";

// Configure the time zone
Settings.defaultZone = "Europe/Berlin"
Settings.defaultLocale = "de-de"

console.log(Settings.defaultZone); // Reading the configured time zone.
console.log(Settings.defaultLocale); // Reading the configured time zone.

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
        <RemixBrowser />
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
