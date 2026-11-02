"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import tmi from "tmi.js";
import { presets, type ChaosEvent, type EventType } from "@/types/events";

export default function Overlay() {
  const [event, setEvent] = useState<ChaosEvent | null>(null); const [status, setStatus] = useState("connecting"); const [votes, setVotes] = useState<Record<string,string>>({}); const [votePanel, setVotePanel] = useState(false); const [timeLeft, setTimeLeft] = useState(30); const [helpVisible,setHelpVisible]=useState(false);
  const lastCommand = useRef(new Map<string,number>()); const queue = useRef<ChaosEvent[]>([]); const showing = useRef(false);
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const channel = params?.get("channel") || process.env.NEXT_PUBLIC_TWITCH_CHANNEL || ""; const demo = params?.get("demo") === "1"; const cooldownValue=Number(params?.get("cooldown")||8); const cooldownSeconds=Number.isFinite(cooldownValue)?Math.max(3,Math.min(cooldownValue,60)):8;
  const show = useCallback((next: ChaosEvent) => { if (showing.current) { if(queue.current.length < 3) queue.current.push(next); return; } showing.current=true; setEvent(next); window.setTimeout(()=>{ setEvent(null); showing.current=false; const upcoming=queue.current.shift(); if(upcoming) window.setTimeout(()=>show(upcoming),250); }, next.durationMs); }, []);
  useEffect(()=>{ const allowedOrigin=window.location.origin; const listener=(e:MessageEvent)=>{ if(e.origin!==allowedOrigin || e.source!==window.parent) return; if(e.data?.type==="CHAOS_DEMO_EVENT") show(e.data.event as ChaosEvent); }; window.addEventListener("message",listener); window.parent.postMessage({type:"CHAOS_OVERLAY_READY"},allowedOrigin); return()=>window.removeEventListener("message",listener); },[show]);
  useEffect(()=>{ if(!channel){setStatus("unconfigured");return;} let client:tmi.Client;
    try { client=new tmi.Client({ options:{ debug:false }, connection:{ reconnect:true, secure:true }, channels:[channel] }); }
    catch { setStatus("error"); return; }
    client.on("connected",()=>setStatus("connected")); client.on("disconnected",()=>setStatus("disconnected")); client.on("notice",()=>{});
    client.on("message",async(_chan,tags,message,self)=>{ if(self) return; const username=(tags.username||tags["display-name"]||"viewer").slice(0,25); const text=message.trim(); const lower=text.toLowerCase();
      if(lower.startsWith("!help")){ setVotePanel(false); setHelpVisible(true); window.setTimeout(()=>setHelpVisible(false),4500); return; }
      if(lower.startsWith("!vote ")){const option=lower.slice(6).trim().slice(0,24); if(!option)return; setVotes(prev=>({...prev,[username]:option})); setVotePanel(true); setTimeLeft(30); return;}
      if(!lower.startsWith("!chaos ")) return; const now=Date.now(); if(now-(lastCommand.current.get(username)||0)<Math.max(3,Math.min(cooldownSeconds,60))*1000) return; lastCommand.current.set(username,now);
      const request=text.slice(7,307).trim(); if(!request)return;
      try { const response=await fetch("/api/chaos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:request,context:"Twitch live stream",username})}); if(!response.ok)return; const parsed=await response.json(); show(parsed as ChaosEvent); } catch { /* next command can retry */ }
    });
    client.connect().catch(()=>setStatus("error")); return()=>{ void client.disconnect(); };
  },[channel,cooldownSeconds,show]);
  useEffect(()=>{window.parent.postMessage({type:"CHAOS_CHAT_STATUS",status},window.location.origin);},[status]);
  useEffect(()=>{if(!votePanel)return;const id=window.setInterval(()=>setTimeLeft(v=>{if(v<=1){setVotePanel(false);const counts=new Map<string,number>();Object.values(votes).forEach(option=>counts.set(option,(counts.get(option)||0)+1));const winner=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0];if(winner){const m=winner.toLowerCase();const type:EventType=/meteor|sky|rain/.test(m)?"meteor":/matrix|code/.test(m)?"matrix":/explod|boom/.test(m)?"explosion":/glitch/.test(m)?"glitch":/celebrat|party|hype/.test(m)?"celebration":"alert";const p=presets[type];show({eventType:type,animationPreset:type,colorHex:p.colorHex,title:p.title,narrativeLabel:`VOTE WINNER · ${winner.slice(0,24)}`,intensity:7,durationMs:5000,username:"community vote"});}setVotes({});return 30;}return v-1;}),1000);return()=>window.clearInterval(id);},[votePanel,votes,show]);
  const effectClass=`effect-${event?.animationPreset||"alert"}`;
  return <main className="overlay-root" aria-label="ChaosForge Twitch stream overlay"><div className="overlay-status"><span className={status==="connected"?"connected":""}/>{status==="connected"?`CHAT LINKED · ${channel}`:status==="unconfigured"?"CHANNEL NOT SET":status==="connecting"?"CONNECTING TO CHAT":status.toUpperCase()}</div>
    <AnimatePresence>{event&&<motion.div key={`${event.title}-${Date.now()}`} className={`event-layer ${effectClass}`} style={{"--event-color":event.colorHex,"--intensity":event.intensity} as React.CSSProperties} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}>
      <div className="fx-vignette"/><div className="fx-lines"/><div className="fx-flash"/><div className="event-content"><div className="event-kicker"><span/> COMMUNITY EVENT <span className="event-divider">/</span> {event.narrativeLabel}</div><motion.div className="event-title" initial={{y:24,opacity:0,scale:.94}} animate={{y:0,opacity:1,scale:1}} transition={{duration:.45,ease:"easeOut"}}>{event.title}</motion.div><div className="event-credit">FORGED BY <b>@{event.username||"the community"}</b></div><div className="event-meta"><span>INTENSITY <b>{event.intensity}/10</b></span><i/><span>CHAOSFORGE AI</span></div></div>
      {event.animationPreset==="matrix"&&<div className="matrix-rain">01001010<br/>10110101<br/>00101101<br/>10011010<br/>01101001</div>}{event.animationPreset==="meteor"&&<div className="meteor-trail"/>}{event.animationPreset==="celebration"&&<div className="confetti">✦　✳　✧　✴　✹　✦</div>}
    </motion.div>}</AnimatePresence>
    <AnimatePresence>{votePanel&&<motion.aside className="vote-panel" initial={{x:380,opacity:0}} animate={{x:0,opacity:1}} exit={{x:380,opacity:0}}><div className="vote-head"><span>CHAT POLL</span><b>{timeLeft}s</b></div><h3>What happens next?</h3>{[...new Set(Object.values(votes))].slice(0,4).map(option=>{const count=Object.values(votes).filter(v=>v===option).length;return <div className="vote-option" key={option}><span>{option}</span><b>{count} vote{count!==1?"s":""}</b></div>})}<small>{Object.keys(votes).length} community votes</small></motion.aside>}</AnimatePresence>
    <AnimatePresence>{helpVisible&&<motion.div className="help-toast" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}><b>CHAOSFORGE COMMANDS</b><span>!chaos &lt;request&gt; · !vote &lt;option&gt; · !help</span></motion.div>}</AnimatePresence>
    {demo&&<div className="demo-chip"><span/> DEMO MODE · Trigger events from the dashboard</div>}</main>;
}
