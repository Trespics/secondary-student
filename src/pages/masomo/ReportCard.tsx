import { useEffect, useState } from "react";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

interface Grade {
  'CAT 1': string | null;
  'CAT 2': string | null;
  'End Term': string | null;
}

interface SubjectPerformance {
  subject_name: string;
  subject_code: string;
  grades: Grade;
}

interface ReportCardData {
  class_name: string;
  subjects: SubjectPerformance[];
}

const ReportCard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportCardData | null>(null);

  useEffect(() => {
    const fetchReportCard = async () => {
      try {
        const response = await api.get("/student/report-card");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch report card:", error);
        toast.error("Failed to load report card data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportCard();
  }, []);

  const getCBCLevel = (score: string | null) => {
    if (!score) return { level: "-", color: "bg-gray-100 text-gray-400" };
    const s = parseFloat(score);
    if (s >= 80) return { level: "EE", color: "bg-green-100 text-green-700" };
    if (s >= 60) return { level: "ME", color: "bg-blue-100 text-blue-700" };
    if (s >= 40) return { level: "AE", color: "bg-yellow-100 text-yellow-700" };
    return { level: "BE", color: "bg-red-100 text-red-700" };
  };

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MasomoPortalLayout>
    );
  }

  return (
    <MasomoPortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Report Card</h1>
            <p className="text-muted-foreground">Class: {data?.class_name || "N/A"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer size={18} /> Print
            </Button>
            <Button className="gap-2">
              <Download size={18} /> Download PDF
            </Button>
          </div>
        </div>

        <Card className="border-indigo-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <FileText className="text-indigo-600" size={20} />
              <CardTitle>Performance Summary</CardTitle>
            </div>
            <CardDescription>
              CBC Performance Levels: EE (Exceeds), ME (Meets), AE (Approaching), BE (Below Expectations)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="text-center font-semibold">CAT 1 (%)</TableHead>
                  <TableHead className="text-center font-semibold">CAT 2 (%)</TableHead>
                  <TableHead className="text-center font-semibold">End Term (%)</TableHead>
                  <TableHead className="text-center font-semibold">Final Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.subjects.map((subject, index) => {
                  const endTermLevel = getCBCLevel(subject.grades['End Term']);
                  return (
                    <TableRow key={index} className="hover:bg-muted/20">
                      <TableCell className="font-medium">
                        {subject.subject_name}
                        <span className="block text-xs text-muted-foreground">{subject.subject_code}</span>
                      </TableCell>
                      <TableCell className="text-center">{subject.grades['CAT 1'] || "-"}</TableCell>
                      <TableCell className="text-center">{subject.grades['CAT 2'] || "-"}</TableCell>
                      <TableCell className="text-center font-semibold">{subject.grades['End Term'] || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={endTermLevel.color}>
                          {endTermLevel.level}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {data?.subjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No assessment data available yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
            <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">EE</p>
            <p className="text-sm font-medium text-green-800">80% - 100%</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">ME</p>
            <p className="text-sm font-medium text-blue-800">60% - 79%</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
            <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-1">AE</p>
            <p className="text-sm font-medium text-yellow-800">40% - 59%</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-center">
            <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">BE</p>
            <p className="text-sm font-medium text-red-800">Below 40%</p>
          </div>
        </div>
      </div>
    </MasomoPortalLayout>
  );
};

export default ReportCard;
