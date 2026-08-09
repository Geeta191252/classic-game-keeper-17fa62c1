import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { useGlobalClickSound } from "@/hooks/useGlobalClickSound";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameFrame from "./components/GameFrame";
import { ReactElement } from "react";
import jetxLogoCard from "@/assets/jetx-logo-card.webp";
import jetxRocketFast from "@/assets/jetx-rocket-fast.webp";
// JetX is statically imported so it opens INSTANTLY (no Suspense flash)
// every time the user re-enters, even mid-round.
import JetXGame from "./pages/JetXGame";

const framed = (el: ReactElement) => <GameFrame>{el}</GameFrame>;

// Lazy-load other heavy game pages so the home screen boots instantly and
// each game only downloads its own chunk on demand (then cached).
const GreedyKingGame = lazy(() => import("./pages/GreedyKingGame"));
const DiceMasterGame = lazy(() => import("./pages/DiceMasterGame"));
const CarnivalSpinGame = lazy(() => import("./pages/CarnivalSpinGame"));
const MinesGame = lazy(() => import("./pages/MinesGame"));
const AviatorFunGame = lazy(() => import("./pages/AviatorFunGame"));
const PlinkoGame = lazy(() => import("./pages/PlinkoGame"));
const ChickenRoadGame = lazy(() => import("./pages/ChickenRoadGame"));
const ChickenClassicGame = lazy(() => import("./pages/ChickenClassicGame"));
const TwistGame = lazy(() => import("./pages/TwistGame"));
const GoblinTower = lazy(() => import("./pages/GoblinTower"));
const RocketCrash = lazy(() => import("./pages/RocketCrash"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminPages = {
  Dashboard: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.Dashboard }))),
  Users: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.UsersPage }))),
  TopUsers: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.TopUsersPage }))),
  PlayerWins: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.PlayerWinsPage }))),
  Games: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.GamesPage }))),
  AviatorFun: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.AviatorFunControlPage }))),
  JetX: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.JetXControlPage }))),
  Deposits: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.DepositsPage }))),
  Withdrawals: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.WithdrawalsPage }))),
  WalletAdjust: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.WalletAdjustPage }))),
  Offers: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.OffersPage }))),
  Analytics: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.AnalyticsPage }))),
  TonWallet: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.TonWalletPage }))),
  Settings: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.SettingsPage }))),
  Profile: lazy(() => import("./pages/admin/pages").then(m => ({ default: m.ProfilePage }))),
  Support: lazy(() => import("./pages/admin/SupportPage")),
};

const queryClient = new QueryClient();

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

const STARTAPP_GAME_ROUTES: Record<string, string> = {
  g_aviator_fun: "/aviator-fun",
  g_mines: "/mines",
  g_dice: "/dice-master",
  g_carnival: "/carnival-spin",
  g_greedy: "/greedy-king",
  g_plinko: "/plinko",
  g_chicken: "/chicken-road",
  g_chicken_classic: "/chicken-classic",
  g_jetx: "/jetx",
  g_twist: "/twist",
  g_goblin: "/goblin-tower",
};

const StartParamNavigator = () => {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      const param: string | undefined = tg?.initDataUnsafe?.start_param;
      if (!param) return;
      const target = STARTAPP_GAME_ROUTES[param];
      if (target) navigate(target, { replace: true });
    } catch {
      // ignore
    }
  }, [navigate]);
  return null;
};

// Prefetch ALL game chunks in parallel immediately so any click opens instantly.
const prefetchGames = () => {
  const loaders: Array<() => Promise<unknown>> = [
    () => import("./pages/AviatorFunGame"),
    () => import("./pages/GreedyKingGame"),
    () => import("./pages/MinesGame"),
    () => import("./pages/DiceMasterGame"),
    () => import("./pages/CarnivalSpinGame"),
    () => import("./pages/PlinkoGame"),
    () => import("./pages/ChickenRoadGame"),
    () => import("./pages/ChickenClassicGame"),
    () => import("./pages/TwistGame"),
    () => import("./pages/GoblinTower"),
  ];
  const start = () => {
    // Fire all in parallel — browser handles queuing; chunks are small and cached.
    loaders.forEach((l) => { try { l().catch(() => {}); } catch { /* noop */ } });
  };
  start();
};

const preloadCriticalImages = () => {
  [jetxLogoCard, jetxRocketFast].forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
  });
};

const RouteFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const NotificationsBridge = () => {
  useTxNotifications();
  return null;
};

const App = () => {
  useGlobalClickSound();
  useEffect(() => {
    preloadCriticalImages();
    prefetchGames();
  }, []);

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/RoyalKingGameBot/RoyalKingGame",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <BalanceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <StartParamNavigator />
              <NotificationsBridge />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/greedy-king" element={framed(<GreedyKingGame />)} />
                  <Route path="/dice-master" element={framed(<DiceMasterGame />)} />
                  <Route path="/carnival-spin" element={framed(<CarnivalSpinGame />)} />
                  <Route path="/mines" element={framed(<MinesGame />)} />
                  <Route path="/aviator-fun" element={framed(<AviatorFunGame />)} />
                  <Route path="/plinko" element={framed(<PlinkoGame />)} />
                  <Route path="/chicken-road" element={framed(<ChickenRoadGame />)} />
                  <Route path="/chicken-classic" element={framed(<ChickenClassicGame />)} />
                  <Route path="/jetx" element={framed(<JetXGame />)} />
                  <Route path="/twist" element={framed(<TwistGame />)} />
                  <Route path="/goblin-tower" element={framed(<GoblinTower />)} />
                  <Route path="/rocket-crash" element={<RocketCrash />} />
                  <Route path="/admin-legacy" element={<AdminPanel />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminPages.Dashboard />} />
                    <Route path="users" element={<AdminPages.Users />} />
                    <Route path="top-users" element={<AdminPages.TopUsers />} />
                    <Route path="games" element={<AdminPages.Games />} />
                    <Route path="player-wins" element={<AdminPages.PlayerWins />} />
                    <Route path="aviator-fun" element={<AdminPages.AviatorFun />} />
                    <Route path="jetx" element={<AdminPages.JetX />} />
                    <Route path="deposits" element={<AdminPages.Deposits />} />
                    <Route path="withdrawals" element={<AdminPages.Withdrawals />} />
                    <Route path="wallet-adjust" element={<AdminPages.WalletAdjust />} />
                    <Route path="offers" element={<AdminPages.Offers />} />
                    <Route path="support" element={<AdminPages.Support />} />
                    <Route path="analytics" element={<AdminPages.Analytics />} />
                    <Route path="ton-wallet" element={<AdminPages.TonWallet />} />
                    <Route path="settings" element={<AdminPages.Settings />} />
                    <Route path="profile" element={<AdminPages.Profile />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </BalanceProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

export default App;
