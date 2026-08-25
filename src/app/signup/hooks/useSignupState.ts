"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { setTokens } from "@/lib/token";
import { toast } from "sonner";

export function useSignupState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get("redirect") : null;
  const dispatch = useAppDispatch();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.warning("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await register(formData).unwrap();
      const accessToken =
        response?.data?.accessToken ||
        response?.accessToken ||
        response?.data?.token ||
        response?.token;
      const refreshToken =
        response?.data?.refreshToken || response?.refreshToken;

      if (accessToken) setTokens(accessToken, refreshToken || "");

      const user = response?.data?.user || response?.user || response;
      if (user) {
        dispatch(setUser(user));
        const userRole =
          typeof user.role === "object" && user.role
            ? user.role.name
            : user.role || "client";
        const roleString =
          typeof userRole === "string"
            ? userRole.toLowerCase().replace(/\s+/g, "")
            : "client";
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `rajseba_user_role=${roleString}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
        toast.success("Registration successful!");
        if (redirectUrl) router.push(redirectUrl);
        else if (roleString === "client") router.push("/dashbord/overview");
        else router.push("/dashbord");
      } else {
        toast.success("Registration successful!");
        router.push(redirectUrl || "/dashbord/overview");
      }
    } catch (err: any) {
      toast.error(
        err.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return {
    formData,
    handleChange,
    agreeTerms,
    setAgreeTerms,
    isLoading,
    handleSubmit,
  };
}
