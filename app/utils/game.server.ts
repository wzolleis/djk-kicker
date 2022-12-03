export type GameFromForm = {
    name: FormDataEntryValue;
    gameTime: FormDataEntryValue | Date;
    userId: FormDataEntryValue;
    location: FormDataEntryValue;
    intent: FormDataEntryValue;

}


export function getGameFromFormData(formData: FormData) {
    const gameFromForm: GameFromForm = {
        name: formData.get("name")!,
        gameTime: formData.get("gameTime")!,
        location: formData.get("location")!,
        userId: formData.get("userId")!,
        intent: formData.get("intent")!,
    }

    return gameFromForm;
}