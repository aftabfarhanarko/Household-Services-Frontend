"use client";

import { useState, useEffect } from "react";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { setTokens } from "@/lib/token";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useLoginState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams ? searchParams.get("redirect") : null;
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [lottieAnimation, setLottieAnimation] = useState<any>(null);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    fetch("/signup.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load Lottie");
        return res.json();
      })
      .then((data) => setLottieAnimation(data))
      .catch((err) => console.error("Error loading Lottie animation:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email address and password");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      const accessToken =
        response?.data?.accessToken ||
        response?.accessToken ||
        response?.data?.token ||
        response?.token;
      const refreshToken =
        response?.data?.refreshToken || response?.refreshToken;

      if (accessToken) setTokens(accessToken, refreshToken || "");

      const user = response?.data?.user || response?.user;
      if (user) {
        const userRole =
          typeof user.role === "object" && user.role
            ? user.role.name
            : user.role || "client";
        const roleString =
          typeof userRole === "string"
            ? userRole.toLowerCase().replace(/\s+/g, "")
            : "client";
        dispatch(setUser(user));
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `rajseba_user_role=${roleString}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
        toast.success("Login successful!");
        if (redirectUrl) router.push(redirectUrl);
        else if (roleString === "client") router.push("/dashbord/overview");
        else router.push("/dashbord");
      } else {
        toast.success("Login successful!");
        router.push(redirectUrl || "/dashbord/overview");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid email address or password.");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    lottieAnimation,
    isLoading,
    handleSubmit,
  };
}
