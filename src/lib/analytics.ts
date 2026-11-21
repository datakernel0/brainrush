type PlausibleFn=(event:string,options?:{props?:Record<string,string|number|boolean>})=>void;
declare global {interface Window {plausible?:PlausibleFn}}
export function trackEvent(name:string,props?:Record<string,string|number|boolean>){try{if(typeof window!=="undefined"&&typeof window.plausible==="function")window.plausible(name,props?{props}:undefined)}catch{/* Analytics must never interrupt gameplay. */}}
