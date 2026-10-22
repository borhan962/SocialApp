export type RegisterFormInputs = LoginFormInputs & {
  name: string;
  username: string;
  gender: string;
  dateOfBirth: string;
  rePassword: string;
}


export type LoginFormInputs = {
  email: string;
  password: string;
}
