import * as z from "zod";

 export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters long").max(25, "Name must be less than 25 characters long"),
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
     dateOfBirth: z.string().min(1, "Date of birth is required").refine((data) => {
      const age = new Date().getFullYear()
      const userAge = new Date(data).getFullYear()
      const currentAge = age - userAge
      return currentAge >= 18 ;
    }, 'You must be at least 18 years old'),
    gender: z.enum(["male", "female"], { message: "Please Select Your Gender" }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
    rePassword: z.string().min(1, "Confirm Your Password"),
  }).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  })