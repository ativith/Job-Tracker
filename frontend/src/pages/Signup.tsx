import React, { useContext, useState } from "react";

import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import jobPic from "../assets/jobPic.jpg";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { UserContext } from "../context/userContext";
function Signup() {
  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  type FormData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  interface LoginResponse {
    user:{
      email:string,
      username:string
    }
    token: string;
  }
  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !form.email ||
      !form.username ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All field are required");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (form.password.length < 7) {
      setError("Password must be at least 7 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axiosInstance.post<LoginResponse>(
        API_PATH.AUTH.REGISTER,
        form
      );
      if (response?.data && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        updateUser(response.data.user)
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("errorhere");
      const axiosError = err as AxiosError<{ message: string }>;

      if (axiosError.response && axiosError.response.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError("Something went wrong, please try again");
      }
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-screen w-screen">
      {/* Left side */}
      <div className="bg-stone-100 p-4 flex items-center justify-center flex-grow-1 ">
        <div className="border-0 rounded-lg bg-stone-200 p-20 w-full ">
          {/* Header */}
          <div className="mb-5">
            <h1 className="mb-10">Registeration</h1>
            <span>Please enter your details</span>
          </div>
          {/* Inputs */}
          <div className="mb-4">
            <TextField
              name="username"
              label="Enter your name"
              variant="outlined"
              className="w-full"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <TextField
              name="email"
              label="Enter your email"
              variant="outlined"
              className="w-full"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <TextField
              name="password"
              label="Create password"
              variant="outlined"
              className="w-full"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <TextField
              name="confirmPassword"
              label="Confirm password"
              variant="outlined"
              className="w-full"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <span className="text-red-500 text-xs">{error}</span>}
          <div className="mb-4">
            <form onClick={handleSignUp}>
              <Button type="submit" variant="contained" className="w-full">
                Sign up
              </Button>
            </form>
          </div>
          <div className="text-center ">
            <span>Already have an account</span>
            <a href="/login" className="text-blue-600 ml-1 hover:underline">
              {" "}
              Sign in
            </a>
          </div>
        </div>
      </div>
      <div className="bg-blue-300 hidden md:block h-full">
        <img src={jobPic} className="w-full h-full object-cover " />
      </div>
    </div>
  );
}

export default Signup;
