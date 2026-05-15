"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Essay } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEssay = async () => {
      try {
        const response = await api.get(`/essays/${params.id}`);
        if (response.data.success) {
          setEssay(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load essay evaluation");
        router.push("/dashboard/history");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) {
      fetchEssay();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/essays/${params.id}`);
      if (response.data.success) {
        toast.success("Essay deleted successfully");
        router.push("/dashboard/history");
      }
    } catch (error) {
      toast.error("Failed to delete essay");
      setIsDeleting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 55) return "text-amber-500";
    return "text-rose-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 55) return "bg-amber-500";
    return "bg-rose-500";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <Card className="h-64 bg-slate-100"></Card>
      </div>
    );
  }

  if (!essay) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push("/dashboard/history")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to History
        </Button>
      </div>

      {/* Main Score Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-md text-sm text-slate-600 font-medium">
            <FileText className="h-4 w-4" />
            {essay.original_filename}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Academic Evaluation Report
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            {essay.summary}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl border border-slate-100 min-w-[200px]">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Final Score
          </span>
          <div
            className={`text-6xl font-black ${getScoreColor(essay.final_score)}`}
          >
            {essay.final_score}
          </div>
          <Badge
            className={`mt-3 ${getScoreColor(essay.final_score).replace("text", "bg")} bg-opacity-10`}
            variant="outline"
          >
            Grade: {essay.grade}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">
            Overview
          </TabsTrigger>
          <TabsTrigger value="feedback" className="rounded-lg">
            Detailed Feedback
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg">
            Manage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Subscores */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Evaluation Criteria</CardTitle>
                <CardDescription>
                  Detailed breakdown of your essay's performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(essay.subscores).map(([key, item]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700 capitalize">
                        {key}
                      </span>
                      <span
                        className={`font-bold ${getScoreColor(item.score)}`}
                      >
                        {item.score}/100
                      </span>
                    </div>
                    <Progress
                      value={item.score}
                      className={`h-2`}
                      indicatorClassName={getProgressColor(item.score)}
                    />
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm bg-emerald-50/50 border-emerald-100">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="h-5 w-5" />
                    <CardTitle className="text-lg">Strengths</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {essay.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-emerald-900 text-sm"
                      >
                        <span className="text-emerald-500">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm bg-rose-50/50 border-rose-100">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-rose-800">
                    <XCircle className="h-5 w-5" />
                    <CardTitle className="text-lg">
                      Areas for Improvement
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {essay.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2 text-rose-900 text-sm">
                        <span className="text-rose-500">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm bg-blue-50/50 border-blue-100">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Lightbulb className="h-5 w-5" />
                    <CardTitle className="text-lg">
                      Actionable Suggestions
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {essay.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-2 text-blue-900 text-sm">
                        <span className="text-blue-500">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Detailed Feedback by Aspect</CardTitle>
              <CardDescription>
                Expand each section to read specific problems and suggested
                improvements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {essay.detailed_feedback.map((feedback, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-slate-800 hover:text-slate-900">
                      {feedback.aspect}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-md">
                        <h4 className="font-semibold text-rose-900 text-sm mb-1">
                          Issue Identified
                        </h4>
                        <p className="text-rose-800 text-sm">
                          {feedback.problem}
                        </p>
                      </div>
                      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-md">
                        <h4 className="font-semibold text-emerald-900 text-sm mb-1">
                          Suggested Improvement
                        </h4>
                        <p className="text-emerald-800 text-sm">
                          {feedback.improvement}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border-rose-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-rose-700">Danger Zone</CardTitle>
              <CardDescription>Manage this evaluation record.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border border-rose-200 rounded-lg p-4 bg-rose-50/50">
                <div>
                  <h4 className="font-medium text-slate-900">
                    Delete Evaluation
                  </h4>
                  <p className="text-sm text-slate-500">
                    Permanently remove this evaluation from your history.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your evaluation report and remove the data from
                        our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                        variant="destructive"
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete evaluation"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
