"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { AgentLog } from "@/lib/supabase";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-sui-400",
};

interface Props {
  logs: AgentLog[];
}

export default function AgentLogFeed({ logs }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          Agent Activity
        </h3>
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#000B1E]"
          />
          <span className="text-base text-gray-400 font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {logs.map((log, i) => {
            const Icon = icons[log.status] || Info;
            const color = colors[log.status] || colors.info;

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className="flex items-start gap-4 py-4 px-5 rounded-xl hover:bg-white/[0.04] transition-colors border border-white/[0.08]"
              >
                <Icon size={20} className={`${color} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-base text-gray-200 truncate font-medium">{log.action}</p>
                  {log.details && (
                    <p className="text-sm text-gray-400 truncate mt-1">
                      {log.details}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500 shrink-0 font-medium">
                  {formatDistanceToNow(new Date(log.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400 font-medium">No activity yet</p>
            <p className="text-base text-gray-500 mt-2">
              Agent logs will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
