export type DeliveryProofPolicy='standard_confirmation'|'rotating_pin'|'high_value_secure';
export type DeliveryProof={policy:DeliveryProofPolicy;pinRequired:boolean;geoRequired:boolean;photoAllowed:boolean;signatureRequired:boolean;recipientConfirmation:boolean};
export function deliveryProofFor(input:{value:number;category?:string;global?:boolean}):DeliveryProof {
  if(input.value>=2_000_000||input.global) return {policy:'high_value_secure',pinRequired:true,geoRequired:true,photoAllowed:true,signatureRequired:input.value>=5_000_000,recipientConfirmation:true};
  if(input.value>=250_000||input.category==='electronics') return {policy:'rotating_pin',pinRequired:true,geoRequired:true,photoAllowed:true,signatureRequired:false,recipientConfirmation:true};
  return {policy:'standard_confirmation',pinRequired:false,geoRequired:true,photoAllowed:true,signatureRequired:false,recipientConfirmation:true};
}
export function rotatingDeliveryPin(seed:string,windowMinutes=10){const bucket=Math.floor(Date.now()/(windowMinutes*60_000));let hash=0;for(const ch of `${seed}:${bucket}`) hash=(hash*31+ch.charCodeAt(0))>>>0;return String(hash%1_000_000).padStart(6,'0');}
