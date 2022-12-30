export class FormWrapper<T extends string> {
    formData: FormData
    constructor(formData: FormData) {
        this.formData = formData
    }

    get(name: T): FormDataEntryValue | null {
        return this.formData.get(name)
    }
}
