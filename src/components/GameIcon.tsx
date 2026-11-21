import {
  Zap,
  MousePointerClick,
  Crosshair,
  Keyboard,
  Flame,
  Grid3x3,
  Hash,
  Layers,
  Boxes,
  ScanEye,
  Palette,
  ArrowRightLeft,
  Divide,
  CalendarCheck,
  Gauge,
  HelpCircle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "reaction-time": Zap,
  "click-speed": MousePointerClick,
  "aim-trainer": Crosshair,
  "typing-speed": Keyboard,
  "fast-tap": Flame,
  "memory-grid": Grid3x3,
  "number-memory": Hash,
  "sequence-recall": Layers,
  "pattern-memory": Boxes,
  "odd-one-out": ScanEye,
  "color-match": Palette,
  "number-sequence": ArrowRightLeft,
  "quick-math": Divide,
  "daily-brain-challenge": CalendarCheck,
  "daily-reaction": Gauge,
};

export default function GameIcon({
  id,
  size = 20,
  className = "",
}: {
  id: string;
  size?: number;
  className?: string;
}) {
  const IconComponent = ICON_MAP[id] || HelpCircle;
  return <IconComponent size={size} className={className} />;
}

