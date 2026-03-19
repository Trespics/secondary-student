import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { 
  Loader2, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertTriangle,
  CheckCircle2,
  Trophy,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const TakeCAT = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchCAT = async () => {
      try {
        const { data } = await api.get(`/student/cats`);
        const found = data.find((c: any) => c.id === id);
        if (!found) {
          toast.error("CAT not found");
          navigate("/masomo/cats");
          return;
        }

        // Logic to check if already submitted could be added here if there's a submissions check for CATs
        
        setCat(found);
        setAnswers(new Array(found.questions?.length || 0).fill(-1));
        setTimeLeft((found.time_limit_minutes || 60) * 60);
      } catch (err) {
        console.error("Fetch CAT error:", err);
        toast.error("Failed to load CAT");
      } finally {
        setLoading(false);
      }
    };
    fetchCAT();
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 || isCompleted || loading || !cat) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted, loading, cat]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isCompleted) return;
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/student/cats/submit", {
        cat_id: id,
        answers: answers
      });
      setResult(data);
      setIsCompleted(true);
      toast.success("CAT submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit CAT. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      </MasomoPortalLayout>
    );
  }

  if (isCompleted) {
    return (
      <MasomoPortalLayout>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative inline-block">
              <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                <Trophy size={64} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -right-2 -bottom-2 h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500"
              >
                <CheckCircle2 size={32} />
              </motion.div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900">CAT Completed!</h1>
              <p className="text-slate-500 text-lg">Your results have been saved.</p>
            </div>

            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div className="space-y-1">
                    <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Your Score</p>
                    <p className="text-5xl font-black">{result?.marks_obtained} / {result?.max_score}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Percentage</p>
                    <p className="text-5xl font-black">
                      {Math.round((result?.marks_obtained / result?.max_score) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate("/masomo/cats")} 
                size="lg" 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white gap-2 h-14 px-8 rounded-2xl"
              >
                Back to CATs <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </MasomoPortalLayout>
    );
  }

  const currentQuestion = cat.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / cat.questions.length) * 100;

  return (
    <MasomoPortalLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{cat.title}</h1>
            <p className="text-slate-500 font-medium">Question {currentQuestionIndex + 1} of {cat.questions.length}</p>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-sm border font-mono text-xl font-bold ${
            timeLeft < 300 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-white border-slate-200 text-slate-700"
          }`}>
            <Clock size={24} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full bg-slate-100" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl leading-relaxed text-slate-800">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option: string, oIndex: number) => (
                    <div
                      key={oIndex}
                      onClick={() => handleOptionSelect(oIndex)}
                      className={`group relative flex items-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                        answers[currentQuestionIndex] === oIndex
                          ? "border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600"
                          : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold mr-4 shrink-0 transition-colors ${
                        answers[currentQuestionIndex] === oIndex
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500"
                      }`}>
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <span className={`text-lg font-medium ${
                        answers[currentQuestionIndex] === oIndex ? "text-indigo-900" : "text-slate-600"
                      }`}>
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-8 bg-slate-50 border-t flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="h-12 px-6 rounded-xl border-slate-200 gap-2 font-bold"
                >
                  <ChevronLeft size={20} /> Previous
                </Button>

                {currentQuestionIndex === cat.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 gap-2 font-bold"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    Submit CAT
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(cat.questions.length - 1, prev + 1))}
                    className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold"
                  >
                    Next Question <ChevronRight size={20} />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Warning */}
        {timeLeft < 300 && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800"
          >
            <AlertTriangle className="shrink-0" size={20} />
            <p className="text-sm font-medium">
              Time is running out! Your progress will be automatically submitted when the timer reaches zero.
            </p>
          </motion.div>
        )}
      </div>
    </MasomoPortalLayout>
  );
};

export default TakeCAT;
