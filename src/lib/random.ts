export function hashSeed(input:string):number { let h=2166136261; for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,16777619)} return h>>>0; }
export function seededRandom(seed:number){let state=seed>>>0;return()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
export function dailySeed(gameId:string,date=new Date()){const utc=date.toISOString().slice(0,10);return hashSeed(`${gameId}:${utc}:v1`)}
export function shuffle<T>(items:T[],rand=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
