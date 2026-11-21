export type RecordValue={value:number;label:string;attempts:number;updatedAt:string};
const PREFIX="brainrush:v1:";
function safeStorage():Storage|null{try{if(typeof window==="undefined")return null;const s=window.localStorage;const k="__brainrush_test__";s.setItem(k,"1");s.removeItem(k);return s}catch{return null}}
export function readRecord(key:string):RecordValue|null{try{const raw=safeStorage()?.getItem(PREFIX+key);if(!raw)return null;const v=JSON.parse(raw) as RecordValue;if(typeof v.value!=="number"||!Number.isFinite(v.value)||typeof v.label!=="string"||typeof v.attempts!=="number")return null;return v}catch{return null}}
export function saveRecord(key:string,value:number,label:string,lowerIsBetter=false){if(!Number.isFinite(value)||value<0)return readRecord(key);const old=readRecord(key);const improved=!old||(lowerIsBetter?value<old.value:value>old.value);const next:RecordValue={value:improved?value:old.value,label:improved?label:old.label,attempts:(old?.attempts??0)+1,updatedAt:new Date().toISOString()};try{safeStorage()?.setItem(PREFIX+key,JSON.stringify(next))}catch{}return next}
export function resetRecords(){try{const s=safeStorage();if(!s)return;const keys:string[]=[];for(let i=0;i<s.length;i++){const k=s.key(i);if(k?.startsWith(PREFIX))keys.push(k)}keys.forEach(k=>s.removeItem(k))}catch{}}
export function readRecent():string[]{try{const s=safeStorage();const v=JSON.parse(s?.getItem(PREFIX+"recent")||"[]");return Array.isArray(v)?v.filter(x=>typeof x==="string").slice(0,6):[]}catch{return[]}}
export function addRecent(slug:string){try{const s=safeStorage();if(!s)return;const a=readRecent().filter(x=>x!==slug);s.setItem(PREFIX+"recent",JSON.stringify([slug,...a].slice(0,6)))}catch{}}
export function markDaily(game:string,date:string){try{safeStorage()?.setItem(PREFIX+`daily:${game}:${date}`,"1")}catch{}}
export function hasDaily(game:string,date:string){try{return safeStorage()?.getItem(PREFIX+`daily:${game}:${date}`)==="1"}catch{return false}}
