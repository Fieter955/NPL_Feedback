"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Home, Upload, History, LogOut, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Evaluate Essay", href: "/dashboard/upload", icon: Upload },
    { name: "History", href: "/dashboard/history", icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <BookOpen className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">Evaluator</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-slate-800 text-emerald-400 font-medium" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-slate-800/50">
            <div className="bg-slate-700 p-2 rounded-full">
              <UserIcon className="h-4 w-4 text-slate-300" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name || "Loading..."}</span>
              <span className="text-xs text-slate-400 truncate">{user?.email || ""}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 md:hidden">
            <BookOpen className="h-6 w-6 text-slate-900 mr-2" />
            <span className="text-lg font-bold tracking-tight text-slate-900">Evaluator</span>
            <div className="ml-auto flex gap-4">
               {navItems.map(item => (
                   <Link key={item.name} href={item.href} className={`text-sm ${pathname === item.href ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                       <item.icon className="h-5 w-5"/>
                   </Link>
               ))}
               <button onClick={handleLogout} className="text-slate-500"><LogOut className="h-5 w-5" /></button>
            </div>
        </header>
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
