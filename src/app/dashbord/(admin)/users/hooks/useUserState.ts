"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation } from "@/redux/features/admin/user";
import { useGetAllRolesQuery } from "@/redux/features/admin/role";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useConfirm } from "@/context/ConfirmDialogContext";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
}

export function useUserState() {
  const confirm = useConfirm();
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const currentUser = useAppSelector((state) => state.auth.user);
  const role = typeof rawRole === "string" ? rawRole.toLowerCase() : (rawRole as any)?.name?.toLowerCase() || "superadmin";

  const [users, setUsers] = useState<UserItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);

  const [selectedDevision, setSelectedDevision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  // Connect APIs
  const { data: apiUsersRes, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery();
  const { data: rolesRes, isLoading: isRolesLoading } = useGetAllRolesQuery();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();

  const [updateUserMut] = useUpdateUserMutation();
  const [createUserMut, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [deleteUserMut] = useDeleteUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();

  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  useEffect(() => {
    let apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);

    // Filter to ONLY show Clients
    apiUsers = apiUsers.filter((u: any) => {
      const uRole = (u.role?.name || u.role || "").toLowerCase();
      return uRole === "client" || uRole === "customer" || uRole === "user";
    });

    // Vendor/Agent only sees their own clients
    if (role === "vendor" || role === "agent") {
      apiUsers = apiUsers.filter(
        (u: any) =>
          u.vendor?.id?.toString() === currentUser?.id?.toString() ||
          u.vendor_id?.toString() === currentUser?.id?.toString() ||
          u.agent?.id?.toString() === currentUser?.id?.toString() ||
          u.agent_id?.toString() === currentUser?.id?.toString()
      );
    }

    if (apiUsers && apiUsers.length > 0) {
      const mappedUsers = apiUsers.map((u: any) => ({
        id: u.id || u._id || `USR-${Math.floor(Math.random() * 1000)}`,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown User",
        email: u.email || "No Email",
        phone: u.phone || u.phoneNumber || "No Phone",
        role: u.role?.name || (typeof u.role === "string" ? u.role : "Customer"),
        status: u.status?.toLowerCase() || "inactive",
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown",
        rating: u.rating || "New",
      }));
      setUsers(mappedUsers);
    } else {
      setUsers([]);
    }
  }, [apiUsersRes, role, currentUser?.id]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      password: formData.get("password"),
      roleId: Number(formData.get("role")),
    };
    if (role === "vendor") {
      data.vendor_id = Number(currentUser?.id);
    } else if (role === "agent") {
      data.agent_id = Number(currentUser?.id);
    }
    try {
      const userRes = await createUserMut(data).unwrap();
      const newUserId = userRes.data?.id || userRes.id;

      setCreatedUserId(newUserId);
      toast.success("User created successfully! Now complete the profile.");
      setStep(2);
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Failed to create user.");
    }
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createdUserId) {
      toast.error("User ID missing. Start over.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const categoryIds = formData.getAll("category_ids").map((id) => Number(id));

    const profileData = {
      user_id: createdUserId,
      category_ids: categoryIds.length > 0 ? categoryIds : undefined,
      type: formData.get("type")?.toString() || "personal",
      location: formData.get("location")?.toString() || "",
      devision_id: selectedDevision ? Number(selectedDevision) : undefined,
      district_id: selectedDistrict ? Number(selectedDistrict) : undefined,
      area_id: selectedArea && !isNaN(Number(selectedArea)) ? Number(selectedArea) : undefined,
      area_name: selectedArea && isNaN(Number(selectedArea)) ? selectedArea : undefined,
      description: formData.get("description")?.toString() || "",
      company_name: formData.get("company_name")?.toString() || "",
      min_starting_price: formData.get("min_starting_price") ? Number(formData.get("min_starting_price")) : 0,
      google_map_link: formData.get("google_map_link")?.toString() || "",
    };

    try {
      await createProfileMut(profileData).unwrap();
      toast.success("Profile created successfully!");
      closeModal();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create profile.");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setStep(1);
    setCreatedUserId(null);
    setSelectedDevision("");
    setSelectedDistrict("");
    setSelectedArea("");
  };

  const handleActivate = async (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "active" as const } : u)));
    try {
      await updateUserMut({ id, data: { status: "active" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeactivate = async (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "inactive" as const } : u)));
    try {
      await updateUserMut({ id, data: { status: "inactive" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlock = async (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "blocked" as const } : u)));
    try {
      await updateUserMut({ id, data: { status: "blocked" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete User?",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteUserMut(id).unwrap();
      toast.success("User deleted successfully!");
      refetch();
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.message || "Failed to delete user.");
    }
  };

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return {
    role,
    users,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUser,
    setSelectedUser,
    openDropdownId,
    setOpenDropdownId,
    step,
    isUsersLoading,
    isRolesLoading,
    rolesRes,
    isCreatingUser,
    isCreatingProfile,
    isCategoriesLoading,
    allCategories,
    selectedDevision,
    setSelectedDevision,
    selectedDistrict,
    setSelectedDistrict,
    selectedArea,
    setSelectedArea,
    handleCreateUser,
    handleCreateProfile,
    closeModal,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
    isAuthenticated,
  };
}
