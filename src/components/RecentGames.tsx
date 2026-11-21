"use client";
import {useEffect,useState} from "react";
import GameCard from "@/components/GameCard";
import {games} from "@/data/games";
import {readRecent} from "@/lib/storage";
export default function RecentGames(){const[recent,setRecent]=useState<string[]>([]);useEffect(()=>setRecent(readRecent()),[]);const items=recent.map(id=>games.find(g=>g.slug===id)).filter((g):g is (typeof games)[number]=>Boolean(g));if(!items.length)return null;return <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>Recently played</h2></div></div><div className="game-grid">{items.map((g,i)=><GameCard key={g.id} game={g} index={i}/>)}</div></div></section>}
