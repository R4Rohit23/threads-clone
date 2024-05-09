export interface IInputFieldProps {
    type: string;
    name: string;
    label: string;
    placeholder?: string;
}

export const Email: IInputFieldProps = {
    type: "email",
    label: "Email",
    name: "email",
    placeholder: "Enter Your Email",
}

export const Password: IInputFieldProps = {
    type: "password",
    label: "Password",
    name: "password",
    placeholder: "Enter Your Password",
}

export const Name: IInputFieldProps = {
    type: "text",
    label: "Name",
    name: "name",
    placeholder: "Enter Your Name",
}

export const Username: IInputFieldProps = {
    type: "text",
    label: "Username",
    name: "username",
    placeholder: "Enter Your Username",
}

export const Bio: IInputFieldProps = {
    type: "text",
    label: "Bio",
    name: "bio",
    placeholder: "Enter Your Bio",
}