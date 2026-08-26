"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllUsersQuery, useUpdateUserMutation, useCreateUserMutation, useDeleteUserMutation } from "@/redux/features/admin/user";
import { useGetAllRolesQuery } from "@/redux/features/admin/role";
import { useCreateProfileMutation, useUpdateProfileMutation } from "@/redux/features/admin/profile";
import { useGetAllCategoriesQuery } from "@/redux/features/admin/category";
import { toast } from "sonner";
import { useConfirm } from "@/context/ConfirmDialogContext";

interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  phone?: string;
  rating?: string;
  categoryName?: string;
  profileId?: number;
  categoryIds?: number[];
  location?: string;
  description?: string;
  min_starting_price?: number;
  google_map_link?: string;
}

export function useEmployeeState() {
  const confirm = useConfirm();
  const rawRole = useAppSelector((state) => state.auth.role) || "superadmin";
  const currentUser = useAppSelector((state) => state.auth.user);
  const role = typeof rawRole === "string" ? rawRole.toLowerCase() : (rawRole as any)?.name?.toLowerCase() || "superadmin";

  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EmployeeItem | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [createdEmployeeId, setCreatedEmployeeId] = useState<number | null>(null);

  const [selectedDevision, setSelectedDevision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);

  const { data: apiUsersRes, isLoading: isUsersLoading, refetch } = useGetAllUsersQuery();
  const { data: rolesRes } = useGetAllRolesQuery();
  const { data: apiCategoriesRes, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();

  const [updateUserMut] = useUpdateUserMutation();
  const [createUserMut, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUserMut] = useDeleteUserMutation();
  const [createProfileMut, { isLoading: isCreatingProfile }] = useCreateProfileMutation();
  const [updateProfileMut, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const allCategories = apiCategoriesRes?.data || (Array.isArray(apiCategoriesRes) ? apiCategoriesRes : []);

  useEffect(() => {
    const apiUsers = apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []);
    if (apiUsers && apiUsers.length > 0) {
      const employeeUsers = apiUsers.filter((u: any) => u.role?.name === "Employee" || u.role === "Employee");
      const mapped = employeeUsers.map((u: any) => ({
        id: u.id || u._id || `EMP-${Math.floor(Math.random() * 1000)}`,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown User",
        email: u.email || "No Email",
        phone: u.phone || u.phoneNumber || "No Phone",
        role: u.role?.name || (typeof u.role === "string" ? u.role : "Employee"),
        status: u.status?.toLowerCase() || "inactive",
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown",
        rating: u.profile?.rating || "New",
        categoryName: u.profile?.categories?.length > 0 ? u.profile.categories.map((c: any) => c.name).join(", ") : "Unassigned",
        profileId: u.profile?.id,
        categoryIds: u.profile?.categories?.map((c: any) => c.id) || [],
        location: u.profile?.location || "",
        description: u.profile?.description || "",
        min_starting_price: u.profile?.min_starting_price || 0,
        google_map_link: u.profile?.google_map_link || "",
      }));
      setEmployees(mapped);
    } else {
      setEmployees([]);
    }
  }, [apiUsersRes]);

  const vendorOptions = (apiUsersRes?.data || (Array.isArray(apiUsersRes) ? apiUsersRes : []))
    .filter((u: any) => u.role?.name === "Vendor" || u.role === "Vendor")
    .map((u: any) => ({
      id: u.id || u._id,
      name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown Vendor",
    }));

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roles = rolesRes?.data || (Array.isArray(rolesRes) ? rolesRes : []);
    const employeeRole = roles.find((r: any) => r.name === "Employee");

    if (!employeeRole) {
      toast.error("Employee role not found in the database!");
      return;
    }

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      roleId: Number(employeeRole.id || employeeRole._id),
      vendor_id: role === "vendor" ? Number(currentUser?.id) : (formData.get("vendor_id") ? Number(formData.get("vendor_id")) : undefined),
      vendor_unique_id: null,
    };

    try {
      const userRes = await createUserMut(userData).unwrap();
      const newUserId = userRes.data?.id || userRes.id;
      setCreatedUserId(newUserId);
      setCreatedEmployeeId(newUserId);
      toast.success("Employee account created! Now complete their profile.");
      setStep(2);
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create employee account.");
    }
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createdEmployeeId) {
      toast.error("User ID missing. Start over.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const categoryIds = formData.getAll("category_ids").map((id) => Number(id));

    const profileData = {
      user_id: createdEmployeeId,
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
      toast.success("Employee profile completed successfully!");
      closeCreateModal();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to create profile.");
    }
  };

  const handleEditEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const formData = new FormData(e.currentTarget);
    const categoryIds = formData.getAll("category_ids").map((id) => Number(id));

    try {
      await updateUserMut({
        id: editingEmployee.id,
        data: {
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
        },
      }).unwrap();

      const profileData = {
        category_ids: categoryIds.length > 0 ? categoryIds : [],
        location: formData.get("location")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        min_starting_price: formData.get("min_starting_price") ? Number(formData.get("min_starting_price")) : 0,
        google_map_link: formData.get("google_map_link")?.toString() || "",
      };

      if (editingEmployee.profileId) {
        await updateProfileMut({ id: editingEmployee.profileId, data: profileData }).unwrap();
      } else {
        await createProfileMut({ ...profileData, user_id: Number(editingEmployee.id), type: "personal" }).unwrap();
      }

      toast.success("Employee updated successfully!");
      setIsEditModalOpen(false);
      setEditingEmployee(null);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || err.message || "Failed to update employee.");
    }
  };

  const closeCreateModal = () => {
    setIsAddModalOpen(false);
    setStep(1);
    setCreatedUserId(null);
    setCreatedEmployeeId(null);
    setSelectedDevision("");
    setSelectedDistrict("");
    setSelectedArea("");
  };

  const handleActivate = async (id: string) => {
    setEmployees((prev) => prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)));
    try {
      await updateUserMut({ id, data: { status: "active" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeactivate = async (id: string) => {
    setEmployees((prev) => prev.map((u) => (u.id === id ? { ...u, status: "inactive" } : u)));
    try {
      await updateUserMut({ id, data: { status: "inactive" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlock = async (id: string) => {
    setEmployees((prev) => prev.map((u) => (u.id === id ? { ...u, status: "blocked" } : u)));
    try {
      await updateUserMut({ id, data: { status: "blocked" } }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Employee?",
      message: "Are you sure you want to delete this employee? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!isConfirmed) return;
    try {
      await deleteUserMut(id).unwrap();
      toast.success("Employee deleted successfully!");
      refetch();
    } catch (e: any) {
      console.error(e);
      toast.error(e.data?.message || "Failed to delete employee.");
    }
  };

  return {
    role,
    currentUser,
    employees,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedUser,
    setSelectedUser,
    openDropdownId,
    setOpenDropdownId,
    step,
    createdUserId,
    createdEmployeeId,
    selectedDevision,
    setSelectedDevision,
    selectedDistrict,
    setSelectedDistrict,
    selectedArea,
    setSelectedArea,
    isEditModalOpen,
    setIsEditModalOpen,
    editingEmployee,
    setEditingEmployee,
    isUsersLoading,
    isCategoriesLoading,
    allCategories,
    vendorOptions,
    isCreating,
    isCreatingProfile,
    isUpdatingProfile,
    handleCreateUser,
    handleCreateProfile,
    handleEditEmployee,
    closeCreateModal,
    handleActivate,
    handleDeactivate,
    handleBlock,
    handleDelete,
  };
}
