import player from "~/routes/application/games/$gameId/player";

export function getFeedbackValues(formData: FormData) {
  const statusFromForm = formData.get("status");
  const noteFromForm = formData.get("note");
  const playerCountFromForm = formData.get("playerCount");
  const gameIdFromForm = formData.get("gameId");

  if (!statusFromForm || !playerCountFromForm) {
    throw new Error("Please provide required arguments: Status or PlayerCount");
  }

  const status = parseInt(statusFromForm.toString());
  const note = noteFromForm?.toString();
  const playerCount = parseInt(playerCountFromForm.toString());
  const gameId = gameIdFromForm?.toString();

  return { status, note, playerCount, gameId };
}
