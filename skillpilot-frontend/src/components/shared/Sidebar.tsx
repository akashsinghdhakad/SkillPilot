"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  Users, 
  CreditCard, 
  Award,
  ChevronRight,
  LogOut,
  Palette,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => (
  <Link href={href}>
    <div className={cn(
      "group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer mb-1",
      active 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 dark:text-slate-400"
    )}>
      <div className="flex items-center gap-3">
        <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400")} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {active && (
        <motion.div layoutId="active-indicator">
          <ChevronRight size={16} />
        </motion.div>
      )}
    </div>
  </Link>
);

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  const studentLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/courses", icon: BookOpen, label: "My Learning" },
    { href: "/certificates", icon: Award, label: "Certificates" },
    { href: "/membership", icon: CreditCard, label: "Membership" },
    { href: "/student/orders", icon: Package, label: "Order History" },
  ];

  const instructorLinks = [
    ...studentLinks,
    { href: "/instructor/courses", icon: Settings, label: "Manage Courses" },
    { href: "/instructor/earnings", icon: CreditCard, label: "Earnings" },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Analytics" },
    { href: "/admin/finance", icon: CreditCard, label: "Finance" },
    ...instructorLinks.filter(l => l.href !== "/dashboard" && l.href !== "/student/orders"), 
    { href: "/admin/tenants", icon: Users, label: "All Tenants" },
    { href: "/admin/users", icon: Users, label: "All Users" },
    { href: "/admin/courses", icon: BookOpen, label: "All Courses" },
    { href: "/admin/bundles", icon: Package, label: "Bundles" },
    { href: "/admin/settings/branding", icon: Palette, label: "Branding" },
    { href: "/admin/settings/billing", icon: Settings, label: "Billing Info" },
  ];

  const hasRole = (roleSlug: string) => {
    if (!user || !user.roles) return false;
    return user.roles.some(r => r.slug === roleSlug);
  };

  const isAdmin = hasRole('admin');
  const isInstructor = hasRole('instructor');

  const navigation = {
    student: [
      { section: "Learning", links: studentLinks },
    ],
    instructor: [
      { section: "Learning", links: studentLinks },
      { section: "Instructor", links: [
        { href: "/instructor/courses", icon: Settings, label: "Manage Courses" },
        { href: "/instructor/earnings", icon: CreditCard, label: "Earnings" },
      ]},
    ],
    admin: [
      { section: "Business", links: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Analytics" },
        { href: "/admin/finance", icon: CreditCard, label: "Finance" },
      ]},
      { section: "Management", links: [
        { href: "/admin/tenants", icon: Users, label: "Tenants" },
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/courses", icon: BookOpen, label: "Courses" },
        { href: "/admin/bundles", icon: Package, label: "Bundles" },
      ]},
      { section: "Settings", links: [
        { href: "/admin/settings/branding", icon: Palette, label: "Branding" },
        { href: "/admin/settings/billing", icon: Settings, label: "Billing Info" },
      ]},
    ]
  };

  const sections = isAdmin ? navigation.admin : (isInstructor ? navigation.instructor : navigation.student);

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 z-50 flex flex-col p-6 transition-colors">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2.5 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
          <GraduationCap size={24} />
        </div>
        <span className="text-xl font-black tracking-tight italic">
          Skill<span className="text-primary">Pilot</span>
        </span>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        {sections.map((section) => (
          <div key={section.section} className="space-y-2">
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 ml-1 opacity-70">
              {section.section}
            </p>
            {section.links.map((link) => (
              <SidebarItem 
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/5 transition-colors font-semibold text-sm"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
