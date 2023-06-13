import {
  GraduationCap,
  LogIn,
  Play,
  PauseCircle,
  TimerReset,
  RotateCcw,
  Save,
  StopCircle,
  XCircle,
  Clipboard,
  Loader2,
  type Icon as LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon;
export const Icons = {
  logo: GraduationCap,
  login: LogIn,
  play: Play,
  pause: PauseCircle,
  chrono: TimerReset,
  newSession: RotateCcw,
  save: Save,
  stop: StopCircle,
  close: XCircle,
  copy: Clipboard,
  loading: Loader2,
};
