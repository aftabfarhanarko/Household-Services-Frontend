"use client";

import { ShieldAlert, PlusCircle, LayoutGrid, Image as ImageIcon, Link2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import HeroModal from "./components/HeroModal";
import DeleteHeroModal from "./components/DeleteHeroModal";
import HeroTable from "./components/HeroTable";
import { useHeroState } from "./hooks/useHeroState";

export default function HeroManagementPage() {
  const {
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
  } = useHeroState();

  const lang = useAppSelector((state) => state.lang.value);

  if (role !== "superadmin" && role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-center animate-in fade-in duration-200">
        <div className="p-4 bg-[#FFF8F4] rounded-2xl text-[#FF6014] mb-4">
          <ShieldAlert size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{lang === "bn" ? "অ্যাক্সেস অস্বীকৃত" : "Access Denied"}</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{lang === "bn" ? "এই প্যানেলটি শুধুমাত্র অ্যাডমিনদের জন্য।" : "This panel is restricted to Administrators. Please switch your role using the selector in the navbar to test this view."}</p>
      </div>
    );
  }

  // Calculate statistics
  const totalHeroes = heroes.length;
  const totalSlides = heroes.reduce((acc, h) => {
    const imgs = Array.isArray(h.images)
      ? h.images
      : typeof h.images === 'string'
        ? (h.images as any).split(',').filter(Boolean)
        : [];
    return acc + imgs.length;
  }, 0);
  const activeLinks = heroes.filter((h) => h.link).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{lang === "bn" ? "হিরো সেকশন ম্যানেজমেন্ট" : "Hero Section Management"}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{lang === "bn" ? "হোমপেজের হিরো স্লাইড, বিবরণ এবং লিংক ম্যানেজ করুন।" : "Manage system-wide hero slides, descriptions, and redirection links."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brand-primary/10"
          >
            <PlusCircle size={18} /> {lang === "bn" ? "হিরো যোগ করুন" : "Add Hero"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {!isHeroesLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden group hover:border-[#FF6014]/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#FFF8F4] blur-2xl -mr-6 -mt-6 group-hover:bg-[#FFF8F4]/80 transition-colors" />
            <div className="relative space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Slots</span>
              <h3 className="text-2xl font-black text-slate-800">{totalHeroes}</h3>
              <p className="text-[10px] font-bold text-slate-400">Hero configurations</p>
            </div>
            <div className="relative p-3 bg-[#FFF8F4] text-[#FF6014] rounded-2xl">
              <LayoutGrid size={22} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden group hover:border-[#FF6014]/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rose-50/50 blur-2xl -mr-6 -mt-6 group-hover:bg-rose-50 transition-colors" />
            <div className="relative space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Images</span>
              <h3 className="text-2xl font-black text-slate-800">{totalSlides}</h3>
              <p className="text-[10px] font-bold text-slate-400">Banner slider slides</p>
            </div>
            <div className="relative p-3 bg-rose-50 text-rose-500 rounded-2xl">
              <ImageIcon size={22} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between relative overflow-hidden group hover:border-[#FF6014]/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-50/50 blur-2xl -mr-6 -mt-6 group-hover:bg-indigo-50 transition-colors" />
            <div className="relative space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CTAs Enabled</span>
              <h3 className="text-2xl font-black text-slate-800">{activeLinks}</h3>
              <p className="text-[10px] font-bold text-slate-400">Slides with action link</p>
            </div>
            <div className="relative p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Link2 size={22} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isHeroesLoading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-8 h-8 border-4 border-[#FF6014] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : heroes.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-2xl mx-auto border-dashed">
          <div className="w-16 h-16 bg-[#FFF8F4] text-[#FF6014] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#FF6014]/10 shadow-inner">
            <LayoutGrid size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800">{lang === "bn" ? "কোনো হিরো সেকশন তৈরি হয়নি" : "No Hero Sections Configured"}</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">{lang === "bn" ? "হোমপেজে প্রমোশন দেখাতে হিরো স্লাইড তৈরি করুন।" : "Create hero slides with title texts, multiple images, and redirection links to showcase promotions on the landing page."}</p>
          <button
            onClick={openCreateModal}
            className="mt-6 bg-[#FF6014] hover:bg-[#E0530A] text-white font-extrabold px-6 py-3 rounded-2xl text-sm transition-all active:scale-[0.98] shadow-md shadow-[#FF6014]/15 inline-flex items-center gap-2"
          >
            <PlusCircle size={16} /> {lang === "bn" ? "হিরো সেকশন তৈরি করুন" : "Create Hero Section"}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/50 rounded-3xl shadow-sm overflow-hidden p-1">
          <HeroTable
            heroes={heroes}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
          />
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <HeroModal
          editingHero={editingHero}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          images={images}
          setImages={setImages}
          text={text}
          setText={setText}
          subtext={subtext}
          setSubtext={setSubtext}
          link={link}
          setLink={setLink}
          isUploadingImage={isUploadingImage}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />
      )}

      <DeleteHeroModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        heroToDelete={heroToDelete}
        setHeroToDelete={setHeroToDelete}
        handleDelete={handleDelete}
      />
    </div>
  );
}
