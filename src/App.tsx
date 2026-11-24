import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Activity, BarChart3, CalendarDays, Dumbbell, Gauge, History, LayoutDashboard, LogOut, Mail, Timer, UserRound, Zap, Plus, Save, ChevronDown } from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type Section = "dashboard" | "workouts" | "register" | "progress" | "coach";
type User = { email?: string };
type Exercise = { name: string; sets: number; reps: string; muscle: string; rest: string; tip: string };
type Log = { id: string; date: string; workout: string; exercise: string; load: number; reps: number; sets: number; rir: number; notes: string };
const plans: Record<string, Exercise[]> = {
 A: [
  {name:"Leg Press 45°",sets:3,reps:"10–12",muscle:"Quadríceps e glúteos",rest:"90 s",tip:"Mantenha a lombar apoiada e não trave os joelhos."},
  {name:"Cadeira extensora",sets:3,reps:"12",muscle:"Quadríceps",rest:"60 s",tip:"Estenda com controle e evite impulso."},
  {name:"Mesa flexora",sets:3,reps:"12",muscle:"Posterior de coxa",rest:"60 s",tip:"Controle a volta do movimento."},
  {name:"Supino máquina",sets:3,reps:"10–12",muscle:"Peito e tríceps",rest:"90 s",tip:"Mantenha as escápulas apoiadas e os punhos alinhados."},
  {name:"Puxada frontal",sets:3,reps:"10–12",muscle:"Costas",rest:"75 s",tip:"Puxe em direção à parte superior do peito."},
  {name:"Desenvolvimento de ombros",sets:2,reps:"12",muscle:"Ombros",rest:"60 s",tip:"Evite arquear a lombar."},
  {name:"Abdominal máquina",sets:2,reps:"15",muscle:"Abdômen",rest:"45 s",tip:"Faça a flexão do tronco sem puxar o pescoço."}
 ],
 B: [
  {name:"Agachamento no Smith",sets:3,reps:"10–12",muscle:"Quadríceps e glúteos",rest:"90 s",tip:"Use amplitude confortável e mantenha os pés firmes."},
  {name:"Cadeira flexora",sets:3,reps:"12",muscle:"Posterior de coxa",rest:"60 s",tip:"Controle a fase de retorno."},
  {name:"Supino inclinado máquina",sets:3,reps:"10–12",muscle:"Peito",rest:"90 s",tip:"Não deixe os ombros avançarem."},
  {name:"Remada baixa",sets:3,reps:"10–12",muscle:"Costas",rest:"75 s",tip:"Puxe os cotovelos para trás sem balançar o tronco."},
  {name:"Elevação lateral",sets:2,reps:"12–15",muscle:"Ombros",rest:"60 s",tip:"Eleve até a linha dos ombros com controle."},
  {name:"Rosca bíceps",sets:2,reps:"12",muscle:"Bíceps",rest:"60 s",tip:"Mantenha os cotovelos próximos ao tronco."},
  {name:"Tríceps pulley",sets:2,reps:"12",muscle:"Tríceps",rest:"60 s",tip:"Estenda os cotovelos sem movimentar os ombros."},
  {name:"Prancha",sets:2,reps:"30–40 s",muscle:"Core",rest:"45 s",tip:"Mantenha o corpo alinhado e respire normalmente."}
 ],
 C: [
  {name:"Elevação pélvica máquina",sets:3,reps:"10–12",muscle:"Glúteos",rest:"90 s",tip:"Finalize contraindo os glúteos sem hiperestender a lombar."},
  {name:"Cadeira abdutora",sets:3,reps:"15",muscle:"Glúteo médio",rest:"60 s",tip:"Abra as pernas com controle, sem impulso."},
  {name:"Cadeira flexora",sets:3,reps:"12",muscle:"Posterior de coxa",rest:"60 s",tip:"Evite tirar o quadril do assento."},
  {name:"Leg Press 45°",sets:3,reps:"12",muscle:"Quadríceps e glúteos",rest:"90 s",tip:"Mantenha a lombar apoiada."},
  {name:"Peck Deck",sets:2,reps:"12",muscle:"Peito",rest:"60 s",tip:"Faça o movimento sem exagerar na abertura."},
  {name:"Remada articulada",sets:3,reps:"10–12",muscle:"Costas",rest:"75 s",tip:"Conduza o movimento com os cotovelos."},
  {name:"Rosca bíceps",sets:2,reps:"12",muscle:"Bíceps",rest:"60 s",tip:"Evite balanço do tronco."},
  {name:"Tríceps pulley",sets:2,reps:"12",muscle:"Tríceps",rest:"60 s",tip:"Mantenha os cotovelos estáveis."},
  {name:"Panturrilha máquina",sets:2,reps:"15",muscle:"Panturrilhas",rest:"45 s",tip:"Use amplitude confortável e pausa no topo."},
  {name:"Abdominal",sets:2,reps:"15",muscle:"Abdômen",rest:"45 s",tip:"Evite puxar a cabeça com as mãos."}
 ]
};
const exerciseImages: Record<string, { id: string; note?: string }> = {
 "Leg Press 45°": { id: "Leg_Press" },
 "Cadeira extensora": { id: "Leg_Extensions" },
 "Mesa flexora": { id: "Lying_Leg_Curls" },
 "Supino máquina": { id: "Leverage_Chest_Press" },
 "Puxada frontal": { id: "Wide-Grip_Lat_Pulldown" },
 "Desenvolvimento de ombros": { id: "Machine_Shoulder_Military_Press" },
 "Abdominal máquina": { id: "Ab_Crunch_Machine" },
 "Agachamento no Smith": { id: "Smith_Machine_Squat" },
 "Cadeira flexora": { id: "Seated_Leg_Curl" },
 "Supino inclinado máquina": { id: "Leverage_Incline_Chest_Press" },
 "Remada baixa": { id: "Seated_Cable_Rows" },
 "Elevação lateral": { id: "Side_Lateral_Raise" },
 "Rosca bíceps": { id: "Barbell_Curl", note: "Referência do movimento; a variação pode usar halteres ou barra." },
 "Tríceps pulley": { id: "Triceps_Pushdown" },
 "Prancha": { id: "Plank" },
 "Elevação pélvica máquina": { id: "Barbell_Hip_Thrust", note: "Referência do movimento; a imagem mostra a versão com barra." },
 "Cadeira abdutora": { id: "", note: "A biblioteca não possui uma foto fiel da cadeira abdutora. Não será exibida uma imagem de outro aparelho." },
 "Peck Deck": { id: "Butterfly" },
 "Remada articulada": { id: "Leverage_Iso_Row" },
 "Panturrilha máquina": { id: "Seated_Calf_Raise" },
 "Abdominal": { id: "Ab_Crunch_Machine" }
};
function exerciseImage(name: string) {
 const image = exerciseImages[name];
 return image?.id ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${image.id}/0.jpg` : "";
}
const nav = [
 {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},{id:"workouts",label:"Minha ficha",icon:Dumbbell},{id:"register",label:"Registrar treino",icon:CalendarDays},{id:"progress",label:"Evolução",icon:BarChart3},{id:"coach",label:"Personal IA",icon:Zap}
] as const;
const STORE = "fit-tracker-records-v1";
function App() {
 const [user,setUser]=useState<User|null>(null); const [section,setSection]=useState<Section>("dashboard");
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [authMode,setAuthMode]=useState<"login"|"signup">("login"); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
 const [logs,setLogs]=useState<Log[]>(()=>{try{return JSON.parse(localStorage.getItem(STORE)||"[]") as Log[]}catch{return[]}});
 const [workout,setWorkout]=useState("A"); const [exercise,setExercise]=useState(plans.A[0].name); const [date,setDate]=useState(new Date().toISOString().slice(0,10));
 const [load,setLoad]=useState(""); const [reps,setReps]=useState("12"); const [sets,setSets]=useState("3"); const [rir,setRir]=useState("2"); const [notes,setNotes]=useState(""); const [seconds,setSeconds]=useState(90); const [timerOn,setTimerOn]=useState(false);
 useEffect(()=>{localStorage.setItem(STORE,JSON.stringify(logs));},[logs]);
 useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setUser(data.session?.user??null));const {data}=supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user??null));return()=>data.subscription.unsubscribe();},[]);
 useEffect(()=>{if(!timerOn)return;const t=window.setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);return()=>window.clearInterval(t);},[timerOn]);
 async function handleAuth(e:FormEvent<HTMLFormElement>){e.preventDefault();if(!supabase)return;setBusy(true);setMessage("");const r=authMode==="login"?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password});setBusy(false);if(r.error)setMessage(r.error.message);else if(authMode==="signup")setMessage("Cadastro enviado. Verifique seu e-mail para confirmar a conta.");}
 async function logout(){await supabase?.auth.signOut();}
 function saveLog(e:FormEvent){e.preventDefault();if(!load||Number(load)<0)return;setLogs(old=>[{id:crypto.randomUUID(),date,workout,exercise,load:Number(load),reps:Number(reps),sets:Number(sets),rir:Number(rir),notes},...old]);setMessage("Registro salvo neste dispositivo.");setLoad("");setNotes("");}
 const selected=plans[workout].find(x=>x.name===exercise)??plans[workout][0];
 const totalExercises=logs.length; const recent=logs.slice(0,5);
 const title=nav.find(n=>n.id===section)?.label;
 const suggestions=useMemo(()=>{const byExercise=new Map<string,Log[]>();logs.forEach(l=>byExercise.set(l.exercise,[...(byExercise.get(l.exercise)||[]),l]));return [...byExercise.entries()].map(([name,items])=>{const latest=items[0];const prior=items[1];if(!prior)return {name,text:"Registre outra sessão para permitir comparação."};if(latest.reps>=12&&latest.rir>=2&&latest.load>=prior.load)return {name,text:"Desempenho consistente. Se todas as séries atingiram o topo da faixa com boa técnica, considere um pequeno aumento na próxima sessão."};if(latest.reps<prior.reps||latest.load<prior.load)return {name,text:"Houve queda em relação ao registro anterior. Avalie sono, recuperação, descanso e execução antes de alterar a carga."};return {name,text:"Mantenha a progressão gradual e acompanhe as próximas sessões."};});},[logs]);
 if(!isSupabaseConfigured)return <main className="setup-screen"><div className="setup-card"><div className="brand-mark"><Dumbbell/></div><p className="eyebrow">SEU TREINO, SEUS DADOS</p><h1>FIT TRACKER</h1><p className="muted">O aplicativo está pronto para iniciar, mas a conexão com o Supabase ainda não foi configurada na Vercel.</p><div className="setup-code"><code>VITE_SUPABASE_URL</code><code>VITE_SUPABASE_PUBLISHABLE_KEY</code></div><p className="small-note">Configure as duas variáveis em Vercel → Project → Settings → Environment Variables e faça um novo Deploy.</p></div></main>;
 if(!user)return <main className="setup-screen"><form className="auth-card" onSubmit={handleAuth}><div className="brand-mark"><Dumbbell/></div><p className="eyebrow">ACOMPANHAMENTO DE HIPERTROFIA</p><h1>{authMode==="login"?"Acesse sua conta":"Crie sua conta"}</h1><p className="muted">Acesse para organizar suas fichas e acompanhar seus treinos.</p><label>E-mail</label><div className="field"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com"/></div><label>Senha</label><input className="password-field" type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required placeholder="Mínimo de 6 caracteres"/><button className="primary-button" disabled={busy}>{busy?"Aguarde...":authMode==="login"?"Entrar":"Cadastrar"}</button>{message&&<p className="form-message">{message}</p>}<button type="button" className="text-button" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setMessage("");}}>{authMode==="login"?"Ainda não tenho conta":"Já tenho uma conta"}</button></form></main>;
 return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-icon"><Dumbbell/></span><span>FIT TRACKER<small>TRAINING PERFORMANCE</small></span></div><div className="nav-label">MENU PRINCIPAL</div><nav>{nav.map(n=>{const I=n.icon;return <button key={n.id} className={section===n.id?"nav-item active":"nav-item"} onClick={()=>setSection(n.id)}><I size={18}/><span>{n.label}</span></button>})}</nav><div className="sidebar-bottom"><div className="user-chip"><UserRound size={18}/><span>{user.email}</span></div><button className="logout-button" onClick={logout}><LogOut size={17}/> Sair</button></div></aside>
 <main className="main-content"><header className="topbar"><div><p className="eyebrow">ÁREA DE TREINAMENTO</p><h1>{title}</h1></div><div className="top-user"><span className="online-dot"/> CONTA CONECTADA</div></header>
 {section==="dashboard"&&<><section className="welcome-panel"><div><p className="eyebrow">VISÃO GERAL</p><h2>Seu progresso começa aqui.</h2><p>Registre cada sessão para acompanhar sua evolução com dados reais.</p></div><div className="welcome-art"><Activity size={62}/></div></section><div className="section-heading"><h2>Resumo do treinamento</h2><span>Dados registrados neste dispositivo</span></div><section className="stat-grid"><article className="stat-card"><div className="stat-icon"><Dumbbell/></div><p>Registros de exercícios</p><strong>{totalExercises}</strong><small>Histórico registrado</small></article><article className="stat-card"><div className="stat-icon"><Gauge/></div><p>Exercícios diferentes</p><strong>{new Set(logs.map(l=>l.exercise)).size}</strong><small>Com registro</small></article><article className="stat-card"><div className="stat-icon"><History/></div><p>Treinos nesta semana</p><strong>{new Set(logs.filter(l=>(Date.now()-new Date(l.date+"T00:00:00").getTime())<7*86400000).map(l=>l.date)).size}</strong><small>Dias com registros</small></article></section><section className="panel"><h3>Últimos registros</h3>{recent.length?recent.map(l=><div className="log-row" key={l.id}><div><b>{l.exercise}</b><small>{l.date} · Treino {l.workout}</small></div><strong>{l.load} kg × {l.reps}</strong></div>):<p className="muted">Nenhum registro ainda. Acesse “Registrar treino” para começar.</p>}</section></>}
 {section==="workouts"&&<><div className="tabs">{["A","B","C"].map(w=><button className={workout===w?"tab active":"tab"} onClick={()=>{setWorkout(w);setExercise(plans[w][0].name);}} key={w}>Treino {w}</button>)}</div><p className="muted">Full Body · {workout==="A"?"Ênfase em pernas, peito e costas":workout==="B"?"Ênfase em costas, peito e braços":"Ênfase em glúteos, posterior e ombros"}</p><div className="exercise-list">{plans[workout].map((x,i)=><article className="exercise-card" key={x.name}><div className="exercise-number">{String(i+1).padStart(2,"0")}</div>{exerciseImage(x.name) ? <img key={exerciseImage(x.name)} className="exercise-photo" src={exerciseImage(x.name)} alt={`Imagem ilustrativa de ${x.name}`} loading="lazy" onError={e=>{e.currentTarget.style.display="none";}}/> : <div className="exercise-photo-placeholder">Foto específica indisponível</div>}<div className="exercise-info"><h3>{x.name}</h3><p>{x.muscle}</p><div className="exercise-meta"><span>{x.sets} séries</span><span>{x.reps} repetições</span><span>Descanso {x.rest}</span></div><small>{x.tip}</small></div><button className="small-action" onClick={()=>{setExercise(x.name);setSection("register");}}>Registrar</button></article>)}</div></>}
 {section==="register"&&<div className="panel"><h2>Novo registro de treino</h2><p className="muted">Informe os dados realizados. O histórico anterior será preservado.</p><form className="record-form" onSubmit={saveLog}><label>Data<input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></label><label>Treino<select value={workout} onChange={e=>{const w=e.target.value;setWorkout(w);setExercise(plans[w][0].name);}}><option value="A">Treino A</option><option value="B">Treino B</option><option value="C">Treino C</option></select></label><label className="wide">Exercício<select value={exercise} onChange={e=>setExercise(e.target.value)}>{plans[workout].map(x=><option key={x.name}>{x.name}</option>)}</select></label><div className="exercise-preview">{exerciseImage(selected.name) ? <img src={exerciseImage(selected.name)} alt={`Imagem ilustrativa de ${selected.name}`} loading="lazy" onError={e=>{e.currentTarget.style.display="none";}}/> : <div className="exercise-preview-placeholder">Foto específica indisponível</div>}<div><b>{selected.name}</b><span>{selected.sets} séries · {selected.reps} repetições · {selected.muscle}</span><small>{exerciseImages[selected.name]?.note || "Imagem ilustrativa do exercício e equipamento correspondente."}</small></div></div><label>Carga (kg)<input type="number" min="0" step="0.5" value={load} onChange={e=>setLoad(e.target.value)} required placeholder="Ex.: 40"/></label><label>Repetições por série<input type="number" min="1" value={reps} onChange={e=>setReps(e.target.value)} required/></label><label>Séries concluídas<input type="number" min="1" max="10" value={sets} onChange={e=>setSets(e.target.value)} required/></label><label>RIR<input type="number" min="0" max="10" value={rir} onChange={e=>setRir(e.target.value)} required/></label><label className="wide">Observações<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Técnica, dificuldade, desconforto..."/></label><button className="primary-button wide"><Save size={16}/> Salvar registro</button>{message&&<p className="form-message wide">{message}</p>}</form><div className="local-warning">Atenção: nesta etapa os registros ficam salvos apenas neste navegador/dispositivo. A sincronização com a nuvem será ativada após concluir a integração das tabelas.</div></div>}
 {section==="progress"&&<div className="panel"><h2>Histórico por exercício</h2><p className="muted">Comparação baseada somente nos dados que você registrou.</p>{logs.length?logs.map(l=><div className="log-row" key={l.id}><div><b>{l.exercise}</b><small>{l.date} · {l.sets} séries · RIR {l.rir}</small></div><strong>{l.load} kg × {l.reps}</strong></div>):<p className="muted">Ainda não há dados suficientes para mostrar evolução.</p>}</div>}
 {section==="coach"&&<div className="panel"><h2>Análise do treinamento</h2><p className="muted">Sugestões orientativas com base nos seus registros, sem aumento automático de carga.</p>{suggestions.length?suggestions.map(s=><article className="coach-card" key={s.name}><b>{s.name}</b><p>{s.text}</p></article>):<p className="muted">Registre pelo menos duas sessões do mesmo exercício para receber uma comparação.</p>}<p className="small-note">Priorize a técnica. Em caso de dor aguda, interrompa o exercício e procure orientação profissional.</p></div>}
 <section className="timer-bar"><div><Timer size={19}/><span>Descanso entre séries</span><b>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</b></div><button onClick={()=>setTimerOn(!timerOn)}>{timerOn?"Pausar":"Iniciar"}</button><button onClick={()=>{setSeconds(90);setTimerOn(false);}}>Reiniciar</button><button onClick={()=>{setSeconds(0);setTimerOn(false);}}>Finalizar</button></section>
 <p className="disclaimer">Os registros desta versão são locais. Não há sincronização entre dispositivos ainda; mantenha backup dos dados até a ativação da nuvem.</p>
 </main></div>;
}
export default App;
