import player from "~/routes/application/games/$gameId/player";

export function getDefaultFeedbackValues(formData: FormData) {
  const statusFromForm = formData.get("status");
  const noteFromForm = formData.get("note");
  const playerCountFromForm = formData.get("playerCount");

  if (!statusFromForm || !playerCountFromForm) {
    throw new Error("Please provide required arguments: Status or PlayerCount");
  }

  const status = parseInt(statusFromForm.toString());
  const note = noteFromForm?.toString();
  const playerCount = parseInt(playerCountFromForm.toString());

  return { status, note, playerCount };
}
