export type AuthFormState = {
    status? : string
    errors? : {
        description? : string[]
        email? : string[]
        password? : string[]
        name? : string[]
        _form? : string[]
    }
}