import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../components/services/api/auth.service";
import type {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
} from "../types/auth";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await authService.login(data);
      handleAuthSuccess(response);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await authService.register(data);
      handleAuthSuccess(response);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("role", response.role);
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
};
