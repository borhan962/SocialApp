export type RegisterFormInputs = LoginFormInputs & {
  name: string;
  username: string;
  gender: "male" | "female";
  dateOfBirth: string;
  rePassword: string;
}


export type LoginFormInputs = {
  email: string;
  password: string;
}
