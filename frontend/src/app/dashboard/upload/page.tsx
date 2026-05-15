"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Invalid file type. Please upload a PDF or DOCX file.");
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // Simulate progress since AI evaluation takes time
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 1000);

      const response = await api.post("/essays/evaluate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.data.success) {
        toast.success("Essay evaluated successfully!");
        setTimeout(() => {
          router.push(`/dashboard/history/${response.data.data.id}`);
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Evaluation failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Evaluate Essay</h1>
        <p className="text-slate-500 mt-2">Upload your academic essay in PDF or DOCX format for comprehensive AI evaluation.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>File should not exceed 10MB.</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:bg-slate-50"
            } ${file ? "bg-slate-50" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && !isUploading && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.docx"
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <File className="h-16 w-16 text-emerald-500 mb-4" />
                <p className="text-lg font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                {!isUploading && (
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Remove File
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center cursor-pointer">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <UploadCloud className="h-10 w-10 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Click to upload or drag and drop</h3>
                <p className="text-sm text-slate-500 mt-2">PDF or DOCX files supported</p>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Evaluating document... This may take up to a minute.
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 w-full" />
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button 
              size="lg" 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="px-8"
            >
              {isUploading ? "Evaluating..." : "Start Evaluation"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-4 text-blue-800">
        <AlertCircle className="h-6 w-6 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-sm">Evaluation Criteria</h4>
          <p className="text-sm mt-1 opacity-90">
            Our AI assesses structure, argumentation, coherence, analysis depth, grammar, and relevance. 
            Ensure your document contains readable text and isn't a scanned image.
          </p>
        </div>
      </div>
    </div>
  );
}
