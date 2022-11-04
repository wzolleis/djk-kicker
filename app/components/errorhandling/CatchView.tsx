import type { ThrownResponse } from "@remix-run/react/dist/errors";

export type CatchViewProps = {
  status: number
  statusText: string | null
  description: string
  caught: ThrownResponse | null
}

const CatchView = ({ status, statusText, description, caught }: CatchViewProps) => {
  return (
    <div>
      <h1>Fehler: {description}</h1>
      <p>Status: {status}</p>
      <p>Grund: {statusText || "Keine Ahnung, was das Problem ist"}</p>
      {
        caught && <pre>
            <code>{JSON.stringify(caught.data, null, 2)}</code>
        </pre>
      }
    </div>
  );
};

export default CatchView;