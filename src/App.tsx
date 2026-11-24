import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Activity, BarChart3, CalendarDays, Dumbbell, Gauge, History,
  LayoutDashboard, LogOut, Mail, Timer, UserRound, Zap
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type Section = "dashboard" | "workouts" | "register" | "progress" | "coach";
type User = { email?: string };

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "workouts", label: "Minha ficha", icon: Dumbbell },
  { id: "register", label: "Registrar treino", icon: CalendarDays },
  { id: "progress", label: "Evolução", icon: BarChart3 },
  { id: "coach", label: "Personal IA", icon: Zap },
] as const;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>("dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const result = authMode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (authMode === "signup") setMessage("Cadastro enviado. Verifique seu e-mail para confirmar a conta.");
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="setup-screen">
        <div className="setup-card">
          <div className="brand-mark"><Dumbbell size={26} /></div>
          <p className="eyebrow">SEU TREINO, SEUS DADOS</p>
          <h1>FIT TRACKER</h1>
          <p className="muted">A estrutura inicial do aplicativo está no GitHub. Para habilitar o acesso, configure as variáveis de ambiente do Supabase.</p>
          <div className="setup-code">
            <code>VITE_SUPABASE_URL</code>
            <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
          </div>
          <p className="small-note">Use o arquivo .env.example como referência. Nunca publique credenciais privadas.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="setup-screen">
        <form className="auth-card" onSubmit={handleAuth}>
          <div className="brand-mark"><Dumbbell size={26} /></div>
          <p className="eyebrow">ACOMPANHAMENTO DE HIPERTROFIA</p>
          <h1>{authMode === "login" ? "Acesse sua conta" : "Crie sua conta"}</h1>
          <p className="muted">Entre para acompanhar seus treinos e manter seus registros sincronizados.</p>
          <label>E-mail</label>
          <div className="field"><Mail size={17} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required /></div>
          <label>Senha</label>
          <input className="password-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="Mínimo de 6 caracteres" required />
          <button className="primary-button" disabled={busy}>{busy ? "Aguarde..." : authMode === "login" ? "Entrar" : "Cadastrar"}</button>
          {message && <p className="form-message">{message}</p>}
          <button type="button" className="text-button" onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setMessage(""); }}>
            {authMode === "login" ? "Ainda não tenho conta" : "Já tenho uma conta"}
          </button>
        </form>
      </main>
    );
  }

  const active = navigation.find((item) => item.id === section);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon"><Dumbbell size={20} /></span><span>FIT TRACKER<small>TRAINING PERFORMANCE</small></span></div>
        <div className="nav-label">MENU PRINCIPAL</div>
        <nav>{navigation.map((item) => {
          const Icon = item.icon;
          return <button key={item.id} className={section === item.id ? "nav-item active" : "nav-item"} onClick={() => setSection(item.id)}><Icon size={18} /><span>{item.label}</span></button>;
        })}</nav>
        <div className="sidebar-bottom"><div className="user-chip"><UserRound size={18} /><span>{user.email}</span></div><button className="logout-button" onClick={handleLogout}><LogOut size={17} /> Sair</button></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">ÁREA DE TREINAMENTO</p><h1>{active?.label}</h1></div><div className="top-user"><span className="online-dot" /> CONTA CONECTADA</div></header>
        {section === "dashboard" ? (
          <>
            <section className="welcome-panel"><div><p className="eyebrow">VISÃO GERAL</p><h2>Seu progresso começa aqui.</h2><p>Registre cada sessão para acompanhar sua evolução com dados reais.</p></div><div className="welcome-art"><Activity size={62} /></div></section>
            <div className="section-heading"><h2>Resumo do treinamento</h2><span>Os indicadores serão preenchidos pelos seus registros.</span></div>
            <section className="stat-grid">
              <article className="stat-card"><div className="stat-icon"><Dumbbell /></div><p>Treinos registrados</p><strong>—</strong><small>Aguardando registros</small></article>
              <article className="stat-card"><div className="stat-icon"><Gauge /></div><p>Exercícios realizados</p><strong>—</strong><small>Aguardando registros</small></article>
              <article className="stat-card"><div className="stat-icon"><History /></div><p>Frequência semanal</p><strong>—</strong><small>Sem histórico suficiente</small></article>
            </section>
            <section className="empty-state"><div className="empty-icon"><BarChart3 size={24} /></div><h3>Seu histórico aparecerá aqui</h3><p>Nenhuma carga ou evolução será exibida antes de existirem registros reais.</p></section>
          </>
        ) : (
          <section className="coming-soon"><div className="empty-icon"><Timer size={25} /></div><p className="eyebrow">PRÓXIMO MÓDULO</p><h2>{active?.label}</h2><p>Esta área será implementada na próxima etapa. Os dados só serão exibidos depois de conectados ao banco.</p></section>
        )}
      </main>
    </div>
  );
}

export default App;