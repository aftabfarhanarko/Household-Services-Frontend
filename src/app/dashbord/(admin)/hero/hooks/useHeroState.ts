"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllHeroesQuery,
  useCreateHeroMutation,
  useUpdateHeroMutation,
  useDeleteHeroMutation,
  Hero,
} from "@/redux/features/admin/hero";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

export function useHeroState() {
  const role = useAppSelector((state) => state.auth.role) || "superadmin";

  const { data: apiHeroesRes, isLoading: isHeroesLoading } = useGetAllHeroesQuery();
  const [createHeroMut, { isLoading: isCreating }] = useCreateHeroMutation();
  const [updateHeroMut, { isLoading: isUpdating }] = useUpdateHeroMutation();
  const [deleteHeroMut] = useDeleteHeroMutation();

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [heroToDelete, setHeroToDelete] = useState<Hero | null>(null);

  // Form states
  const [images, setImages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [subtext, setSubtext] = useState("");
  const [link, setLink] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const apiHeroes = apiHeroesRes?.data || (Array.isArray(apiHeroesRes) ? apiHeroesRes : []);
    setHeroes(apiHeroes);
  }, [apiHeroesRes]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      const file = files[0];
      const url = await uploadImage(file);
      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const openCreateModal = () => {
    setEditingHero(null);
    setImages([]);
    setText("");
    setSubtext("");
    setLink("");
    setIsModalOpen(true);
  };

  const openEditModal = (hero: Hero) => {
    setEditingHero(hero);
    const heroImages = Array.isArray(hero.images)
      ? hero.images
      : typeof hero.images === 'string'
      ? (hero.images as string).split(',').filter(Boolean)
      : [];
    setImages(heroImages);
    setText(hero.text || "");
    setSubtext(hero.subtext || "");
    setLink(hero.link || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      images,
      text: text.trim() || undefined,
      subtext: subtext.trim() || undefined,
      link: link.trim() || undefined,
    };

    try {
      if (editingHero) {
        await updateHeroMut({
          id: editingHero.id,
          data: payload,
        }).unwrap();
        toast.success("Hero section updated successfully!");
      } else {
        await createHeroMut(payload).unwrap();
        toast.success("Hero section created successfully!");
      }
      setIsModalOpen(false);
    } catch (e: any) {
      console.error("Failed to save hero section:", e);
      toast.error(e.data?.message || e.message || "Failed to save hero section");
    }
  };

  const openDeleteModal = (hero: Hero) => {
    setHeroToDelete(hero);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!heroToDelete) return;
    try {
      await deleteHeroMut(heroToDelete.id).unwrap();
      toast.success("Hero section deleted successfully!");
      setIsDeleteModalOpen(false);
      setHeroToDelete(null);
    } catch (e: any) {
      console.error("Failed to delete hero section:", e);
      toast.error(e.data?.message || e.message || "Failed to delete hero section");
    }
  };

  return {
    role,
    isHeroesLoading,
    heroes,
    isModalOpen,
    setIsModalOpen,
    editingHero,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    heroToDelete,
    setHeroToDelete,
    images,
    setImages,
    text,
    setText,
    subtext,
    setSubtext,
    link,
    setLink,
    isUploadingImage,
    handleImageUpload,
    removeImage,
    openCreateModal,
    openEditModal,
    handleSubmit,
    openDeleteModal,
    handleDelete,
    isCreating,
    isUpdating,
  };
}
