"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation } from "@/redux/features/admin/user";
import { useGetAllRolesQuery } from "@/redux/features/admin/role";
import { useCreateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { useConfirm } from "@/context/ConfirmDialogContext";

interface VendorItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  categoryName?: string;
  profile?: any;
  commission_percentage: number;
  wallet_balance: number;
}

export function useVendorState() {
  const confirm = useConfirm();
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<VendorItem | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);

  const [profileType, setProfileType] = useState<string>("personal");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);

  // Connect APIs
  const { data: apiUsersRes, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery();
  const { data: rolesRes } = useGetAllRolesQuery();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();

  const [updateUserMut] = useUpdateUserMutation();
  const [createUserMut, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [deleteUserMut] = useDeleteUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();

  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  useEffect(() => {
    const apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);
    if (apiUsers && apiUsers.length > 0) {
      // Filter only vendors
      const vendorUsers = apiUsers.filter((u: any) => u.role?.name === "Vendor" || u.role === "Vendor");

      const mappedUsers = vendorUsers.map((u: any) => ({
        id: u.id || u._id || `VND-${Math.floor(Math.random() * 1000)}`,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown Vendor",
        email: u.email || "No Email",
        phone: u.phone || u.phoneNumber || "No Phone",
        role: u.role?.name || (typeof u.role === "string" ? u.role : "Vendor"),
        status: u.status?.toLowerCase() || "inactive",
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown",
        categoryName: u.profile?.category?.name || "Unassigned",
        profile: u.profile,
        commission_percentage: u.commission_percentage || 0,
        wallet_balance: u.wallet_balance || 0,
      }));
      setVendors(mappedUsers);
    } else {
      setVendors([]);
    }
  }, [apiUsersRes]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const roles = rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []);
    const vendorRole = roles.find((r: any) => r.name === "Vendor");

    if (!vendorRole) {
      toast.error("Vendor role not found in the database!");
      return;
    }

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      roleId: Number(vendorRole.id || vendorRole._id),
      commission_percentage: Number(formData.get("commission_percentage")) || 0,
    };

    try {
      const userRes = await createUserMut(userData).unwrap();
      const newUserId = userRes.data?.id || userRes.id;
      setCreatedUserId(newUserId);
      toast.success("Vendor user account created! Now complete the profile.");
      setStep(2); // Move to Step 2
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create vendor user.");
    }
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createdUserId) {
      toast.error("User ID missing. Start over.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const profileData = {
      user_id: createdUserId,
      type: profileType,
      description: formData.get("description")?.toString() || "",
      company_name: formData.get("company_name")?.toString() || "",
      min_starting_price: formData.get("min_starting_price") ? Number(formData.get("min_starting_price")) : 0,
      google_map_link: formData.get("google_map_link")?.toString() || "",
    };

    try {
      await createProfileMut(profileData).unwrap();
      toast.success("Vendor profile completed successfully!");
      closeModal();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create vendor profile.");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setStep(1);
    setCreatedUserId(null);
    setProfileType("personal");
  };

  const handleEditVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingVendor) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      commission_percentage: Number(formData.get("commission_percentage")) || 0,
    };
    try {
      await updateUserMut({ id: editingVendor.id, data }).unwrap();
      toast.success("Vendor updated successfully!");
      setIsEditModalOpen(false);
      setEditingVendor(null);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to update vendor.");
    }
  };

  const handleActivate = async (id: string) => {
    setVendors((prev) => prev.map((u) => (u.id === id ? { ...u, status: "active" as const } : u)));
    try {
      await updateUserMut({ id, data: { status: "active" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeactivate = async (id: string) => {
    setVendors((prev) => prev.map((u) => (u.id === id ? { ...u, status: "inactive" as const } : u)));
    try {
      await updateUserMut({ id, data: { status: "inactive" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlock = async (id: string) => {
    setVendors((prev) => prev.map((u) => (u.id === id ? { ...u, status: "blocked" as const } : u)));
    try {
      await updateUserMut({ id, data: { status: "blocked" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Vendor?",
      message: "Are you sure you want to delete this vendor? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteUserMut(id).unwrap();
      toast.success("Vendor deleted successfully!");
      refetch();
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.message || "Failed to delete vendor.");
    }
  };

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return {
    role,
    vendors,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUser,
    setSelectedUser,
    openDropdownId,
    setOpenDropdownId,
    step,
    isUsersLoading,
    profileType,
    setProfileType,
    isEditModalOpen,
    setIsEditModalOpen,
    editingVendor,
    setEditingVendor,
    handleCreateUser,
    handleCreateProfile,
    closeModal,
    handleEditVendor,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
    isAuthenticated,
    isCreatingUser,
    isCreatingProfile,
  };
}
