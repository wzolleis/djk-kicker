import type {EntryContext} from "@remix-run/node";
import {RemixServer} from "@remix-run/react";
import {renderToString} from "react-dom/server";
import {Settings} from "luxon";

// Configure the time zone
Settings.defaultZone = "Europe/Berlin"
Settings.defaultLocale = "de-de"

console.group('entry.server')
console.info(Settings.defaultZone); // Reading the configured time zone.
console.info(Settings.defaultLocale); // Reading the configured time zone.
console.groupEnd()

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
