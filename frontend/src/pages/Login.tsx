import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import jobPic from "../assets/jobPic.jpg";
import { useState } from "react";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { AxiosError } from "axios";
function Login() {
  const { updateUser } = useContext(UserContext);
  type FormData = {
    email: string;
    password: string;
  };
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  interface LoginResponse {
    user: {
      id: number;
      username: string;
      email: string;
    };
    token: string;
  }
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    console.log("Submitting form", form);

    try {
      const response = await axiosInstance.post<LoginResponse>(
        API_PATH.AUTH.LOGIN,
        form
      );

      if (response.data) {
        localStorage.setItem("token", response.data.token);
        updateUser(response.data.user);
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
            <h1 className="mb-10">Welcome Back</h1>
            <span>Please enter your details</span>
          </div>
          {/* Inputs */}
          <div className="mb-4">
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              className="w-full"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Password"
              name="password"
              variant="outlined"
              className="w-full"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {/* Forgot Password */}
          <div className="mb-4 flex justify-end">
            <a href="" className="text-blue-600 hover:underline">
              Forgot a Password?
            </a>
          </div>
          {error && <span className="text-red-500 text-xs">{error}</span>}
          <div className="mb-4">
            <form onSubmit={handleSignIn}>
              <Button variant="contained" className="w-full " type="submit">
                Sign in
              </Button>
            </form>
          </div>
          <div className="text-center ">
            <span>Don't have an account</span>
            <a href="/signup" className="text-blue-600 ml-1 hover:underline">
              {" "}
              Sign up
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

export default Login;
