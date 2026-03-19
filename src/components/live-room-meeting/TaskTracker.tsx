import { useEffect, useState } from "react";
import {
  FileText,
  Clipboard,
  Mail,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface Task {
  id: string;
  title: string;
  startedAt?: number;
  completedAt?: number;
  progress: number;
  status: "pending" | "in-progress" | "completed";
}

const TASKS: Task[] = [
  {
    id: "1",
    title: "Summarizing Key Points",
    startedAt: Date.now() - 600000, // 10 mins ago
    completedAt: Date.now() - 450000, // 7.5 mins ago
    progress: 100,
    status: "completed",
  },
  {
    id: "2",
    title: "Analyzing Market Trends",
    startedAt: Date.now() - 180000, // 3 mins ago
    progress: 65,
    status: "in-progress",
  },
  {
    id: "3",
    title: "Extracting Action Items",
    progress: 0,
    status: "pending",
  },
];

const formatDuration = (start?: number, end?: number) => {
  if (!start) return "0:00";
  const durationMs = (end || Date.now()) - start;
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const TaskTracker = () => {
  const [now, setNow] = useState(Date.now());
  const [viewResultDialog, setViewResultDialog] = useState(false);

  console.log(now);

  useEffect(() => {
    const hasActiveTask = TASKS.some((t) => t.status === "in-progress");
    if (!hasActiveTask) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
          <div className="size-2 bg-[#7F0DF2] rounded-full animate-pulse shadow-[0_0_10px_#7F0DF2]" />
          ACTIVE TASKS
        </h3>
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
          Live Updates
        </span>
      </div>

      <div className="space-y-3">
        {TASKS.length > 0 ? (
          TASKS.map((task) => (
            <div
              key={task.id}
              className="group relative bg-[#050505]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 transition-all duration-500 hover:border-[#7F0DF2]/40 hover:bg-[#050505]/60 hover:shadow-[0_0_30px_rgba(127,13,242,0.1)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      task.status === "completed"
                        ? "bg-[#7F0DF2]/10 border-[#7F0DF2]/20 text-[#7F0DF2]"
                        : task.status === "in-progress"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : "bg-white/5 border-white/10 text-white/30"
                    }`}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 size={16} />
                    ) : task.status === "in-progress" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#7F0DF2] transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-[10px] text-white/40 font-medium">
                      Duration:{" "}
                      {formatDuration(task.startedAt, task.completedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-black ${
                      task.status === "completed"
                        ? "text-[#7F0DF2]"
                        : "text-white/60"
                    }`}
                  >
                    {task.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                    task.status === "completed"
                      ? "bg-[#7F0DF2]"
                      : "bg-linear-to-r from-[#7F0DF2] to-blue-500"
                  }`}
                  style={{ width: `${task.progress}%` }}
                >
                  {task.status === "in-progress" && (
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                  )}
                </div>
              </div>

              {task.status === "completed" && (
                <div className="mt-2">
                  <Button
                    className="bg-transparent hover:bg-transparent text-[10px]"
                    onClick={() => {
                      setViewResultDialog(true);
                    }}
                  >
                    View Result
                  </Button>

                  <Dialog
                    open={viewResultDialog}
                    onOpenChange={setViewResultDialog}
                  >
                    {/* <DialogTrigger>Open</DialogTrigger> */}
                    <DialogContent className="glass">
                      <DialogHeader>
                        <DialogTitle>Final Result</DialogTitle>
                        <DialogDescription>
                          Lorem ipsum dolor, sit amet consectetur adipisicing
                          elit. Reprehenderit, perspiciatis. Voluptatum
                          repellendus ab perferendis placeat minus laboriosam
                          officia doloribus dolorem ullam, velit expedita
                          deserunt nihil amet, voluptas consequatur blanditiis
                          sunt maiores! Recusandae distinctio sed ducimus
                          placeat, dolorem suscipit fugit magni quos corrupti a
                          minima, consectetur deserunt commodi maiores non
                          repellat!
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter>
                        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-700">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 border border-white/5 rounded-lg flex-1"
                          >
                            <FileText size={12} className="mr-1.5" />
                            PDF
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 border border-white/5 rounded-lg flex-1"
                          >
                            <Clipboard size={12} className="mr-1.5" />
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[10px] font-black uppercase tracking-wider text-[#7F0DF2] hover:bg-[#7F0DF2]/5 border border-[#7F0DF2]/20 rounded-lg flex-1"
                          >
                            <Mail size={12} className="mr-1.5" />
                            Email
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Actions for Completed Tasks */}
              {task.status === "completed" && (
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 border border-white/5 rounded-lg flex-1"
                  >
                    <FileText size={12} className="mr-1.5" />
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 border border-white/5 rounded-lg flex-1"
                  >
                    <Clipboard size={12} className="mr-1.5" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[10px] font-black uppercase tracking-wider text-[#7F0DF2] hover:bg-[#7F0DF2]/5 border border-[#7F0DF2]/20 rounded-lg flex-1"
                  >
                    <Mail size={12} className="mr-1.5" />
                    Email
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-white/40 text-sm">
            No Assigned tasks yet
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
