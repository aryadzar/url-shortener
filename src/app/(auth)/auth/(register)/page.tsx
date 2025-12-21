import RegisterForm from "@/components/auth/form-register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for a new URL Shortener account",
};

export default function Register() {
  return (
    <RegisterForm/>
  )
}
