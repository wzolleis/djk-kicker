export type GameFromForm = {
    name: string;
    gameTime: string;
    userId: FormDataEntryValue;
    location: string;
    banner: string;
    intent: FormDataEntryValue;
};

export function getGameFromFormData(formData: FormData) {
    const gameFromForm: GameFromForm = {
        name: formData.get("name")?.toString() || "no name",
        gameTime: formData.get("gameTime")?.toString() || "",
        location:
            formData.get("location")?.toString() || 'Halle',
        userId: formData.get("userId")!,
        intent: formData.get("intent")!,
        banner: formData.get('banner')?.toString() || ''
    };

    return gameFromForm;
}
