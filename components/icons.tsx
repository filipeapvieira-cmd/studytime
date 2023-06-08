import {
  GraduationCap,
  LogIn,
  Play,
  PauseCircle,
  TimerReset,
  RotateCcw,
  Save,
  StopCircle,
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
};
