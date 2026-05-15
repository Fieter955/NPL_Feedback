"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trophy, TrendingUp, Clock, Upload, History } from "lucide-react";
import { api } from "@/lib/api";
import { EssayHistoryItem } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [recentEssays, setRecentEssays] = useState<EssayHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/essays/history");
        if (response.data.success) {
          setRecentEssays(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalEssays = recentEssays.length;
  const avgScore = totalEssays > 0 
    ? Math.round(recentEssays.reduce((acc, curr) => acc + curr.final_score, 0) / totalEssays)
    : 0;
  
  const highestScore = totalEssays > 0 
    ? Math.max(...recentEssays.map(e => e.final_score))
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Overview of your academic evaluations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Evaluated</CardTitle>
            <FileText className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalEssays}</div>
            <p className="text-xs text-slate-500 mt-1">Essays processed</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{avgScore}</div>
            <p className="text-xs text-slate-500 mt-1">Overall performance</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Highest Score</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{highestScore}</div>
            <p className="text-xs text-slate-500 mt-1">Best submission</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Evaluations</CardTitle>
            <CardDescription>Your latest essay submissions and their grades.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="h-10 w-10 bg-slate-200 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentEssays.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-10 w-10 text-slate-300 mb-4" />
                <p className="text-slate-500">No evaluations yet.</p>
                <Link href="/dashboard/upload" className="mt-4">
                  <Button variant="outline">Evaluate your first essay</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {recentEssays.slice(0, 5).map((essay) => (
                  <div key={essay.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900">
                        {essay.original_filename}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(essay.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`font-bold text-lg ${essay.final_score >= 70 ? 'text-emerald-600' : essay.final_score >= 55 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {essay.final_score}
                      </div>
                      <Link href={`/dashboard/history/${essay.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200 shadow-sm bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">What would you like to do next?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/upload" className="block">
              <div className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Upload Essay</h3>
                  <p className="text-sm text-slate-400">Evaluate a new document (PDF/DOCX)</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/history" className="block">
              <div className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full text-blue-400">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">View History</h3>
                  <p className="text-sm text-slate-400">Review past evaluations and feedback</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
