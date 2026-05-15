"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Calendar, ChevronRight, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { EssayHistoryItem } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [essays, setEssays] = useState<EssayHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/essays/history");
        if (response.data.success) {
          setEssays(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 55) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Evaluation History</h1>
        <p className="text-slate-500 mt-2">View all your previously evaluated essays and reports.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : essays.length === 0 ? (
        <Card className="border-slate-200 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No evaluations found</h3>
            <p className="text-slate-500 mt-1 mb-6 text-center max-w-sm">
              You haven't evaluated any essays yet. Upload your first document to see it here.
            </p>
            <Link href="/dashboard/upload">
              <Button>Upload Essay</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {essays.map((essay) => (
            <Link key={essay.id} href={`/dashboard/history/${essay.id}`}>
              <Card className="border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer h-full group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <Badge variant="outline" className={`${getScoreColor(essay.final_score)}`}>
                      {essay.grade}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-tight group-hover:text-slate-900 text-slate-800 line-clamp-2">
                    {essay.original_filename}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center text-xs text-slate-500">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(essay.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900">{essay.final_score}</span>
                      <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
