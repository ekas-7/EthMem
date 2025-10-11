import { cn } from "../lib/cn";
import HelloButton from "./HelloButton";

export default function Home() {
  return (
    <div className={cn("min-h-screen flex items-center justify-center p-8")}>
      <HelloButton />
    </div>
  );
}
