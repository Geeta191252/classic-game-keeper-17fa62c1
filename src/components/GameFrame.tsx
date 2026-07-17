import { ReactNode } from "react";

/**
 * Consistent mobile-phone frame for every game screen so screens
 * don't look bigger/smaller depending on the game. Centers content
 * on tablet/desktop while keeping full width on phones.
 */
const GameFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-black flex justify-center">
      <div className="w-full max-w-md min-h-screen relative overflow-hidden shadow-2xl">
        {children}
      </div>
    </div>
  );
};

export default GameFrame;
