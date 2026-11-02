"use client";

import { motion } from "framer-motion";
import { Crosshair, Radio, Zap } from "lucide-react";

export default function HeroVisual() {
  return <motion.div className="hero-visual" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
    <div className="visual-top"><div className="window-dots"><b/><b/><b/></div><span>CHAOSFORGE // LIVE FEED</span><span className="visual-live"><i/> LIVE</span></div>
    <div className="visual-stage"><div className="stage-grid"/><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="stage-target"><Crosshair size={58}/><span>EVENT DETECTED</span></div><div className="event-toast"><span className="toast-icon"><Zap size={17}/></span><div><small>CHAOS EVENT · JUST NOW</small><strong>CHAT DETONATION</strong></div><span className="toast-level">LVL 08</span></div><div className="stage-caption">“make it rain meteors”</div></div>
    <div className="visual-footer"><span><Radio size={13}/> TWITCH IRC CONNECTED</span><span>AI ENGINE <b>READY</b></span></div>
  </motion.div>;
}
