import { useEffect, useState } from "react";
import {
  FileText,
  Clipboard,
  Mail,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeetingStore } from "@/store/meeting.store";
import type { ActiveTask } from "@/store/meeting.store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatDuration = (start?: number, end?: number, now?: number) => {
  if (!start) return "0:00";
  const durationMs = (end || now || Date.now()) - start;
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const TaskCard = ({
  task,
  now,
}: {
  task: ActiveTask;
  now: number;
}) => {
  const [viewResultDialog, setViewResultDialog] = useState(false);
  const { removeTask } = useMeetingStore();

  const handleCopyResult = () => {
    if (task.result) {
      navigator.clipboard.writeText(task.result);
    }
  };

  return (
    <div className="group relative bg-[#050505]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 transition-all duration-500 hover:border-[#B6FF3B]/40 hover:bg-[#050505]/60 hover:shadow-[0_0_30px_rgba(127,13,242,0.1)]">
      {/* Dismiss button for completed tasks */}
      {task.status === "completed" && (
        <button
          onClick={() => removeTask(task.id)}
          className="absolute top-3 right-3 text-white/20 hover:text-white/60 transition-colors"
        >
          <X size={14} />
        </button>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl border ${
              task.status === "completed"
                ? "bg-[#B6FF3B]/10 border-[#B6FF3B]/20 text-[#B6FF3B]"
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
            <h4 className="text-[12px] font-bold text-white group-hover:text-[#B6FF3B] transition-colors">
              {task.title}
            </h4>
            <p className="text-[10px] text-white/40 font-medium">
              <span className="text-[#B6FF3B]/60">{task.agentName}</span>
              {" · "}
              {formatDuration(task.startedAt, task.completedAt, now)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-black ${
              task.status === "completed"
                ? "text-[#B6FF3B]"
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
              ? "bg-[#B6FF3B]"
              : "bg-linear-to-r from-[#B6FF3B] to-[#B6FF3B]"
          }`}
          style={{ width: `${task.progress}%` }}
        >
          {task.status === "in-progress" && (
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          )}
        </div>
      </div>

      {/* View Result button for completed tasks */}
      {task.status === "completed" && task.result && (
        <div className="mt-3">
          <Button
            className="bg-transparent hover:bg-white/5 text-[10px] text-white/50 hover:text-white transition-colors px-0"
            onClick={() => setViewResultDialog(true)}
          >
            <Sparkles size={12} className="mr-1.5 text-[#B6FF3B]" />
            View Result
          </Button>

          <Dialog
            open={viewResultDialog}
            onOpenChange={setViewResultDialog}
          >
            <DialogContent className="glass max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-[#B6FF3B]" />
                  {task.title}
                </DialogTitle>
                <DialogDescription className="text-[10px] text-white/40">
                  Completed by {task.agentName} · Duration{" "}
                  {formatDuration(task.startedAt, task.completedAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[300px] overflow-y-auto pr-2">
                <p className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap">
                  {task.result}
                </p>
              </div>

              <DialogFooter>
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-700 w-full">
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
                    onClick={handleCopyResult}
                    className="h-8 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 border border-white/5 rounded-lg flex-1"
                  >
                    <Clipboard size={12} className="mr-1.5" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[10px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-[#7F0DF2]/5 border border-[#7F0DF2]/20 rounded-lg flex-1"
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
    </div>
  );
};

export const TaskTracker = () => {
  const { activeTasks } = useMeetingStore();
  const [now, setNow] = useState(() => Date.now());

  // Live clock for duration display
  useEffect(() => {
    const hasActiveTask = activeTasks.some((t) => t.status === "in-progress");
    if (!hasActiveTask) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTasks]);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between mb-2 gap-5">
        <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
          <div className="size-2 bg-[#B6FF3B] rounded-full animate-pulse shadow-[0_0_10px_#B6FF3B]" />
          ACTIVE TASKS
        </h3>
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
          {activeTasks.length > 0 ? "Live Updates" : "No Tasks"}
        </span>
      </div>

      <div className="space-y-3">
        {activeTasks.length > 0 ? (
          activeTasks.map((task) => (
            <TaskCard key={task.id} task={task} now={now} />
          ))
        ) : (
          <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl">
            <Clock size={24} className="mx-auto text-white/10 mb-3" />
            <p className="text-white/30 text-xs font-medium">
              No active tasks yet
            </p>
            <p className="text-white/15 text-[10px] mt-1">
              Click an agent action to start a task
            </p>
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
