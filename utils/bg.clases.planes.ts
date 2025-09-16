import { class_planes } from "@/class/planes/planes.class";

export function bg_planes(plan: string): string {
  return plan == class_planes.premium ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : plan == class_planes.vip ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : plan == class_planes.basic ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500";
}

export function bg_planesUser(plan: string): string {
  return plan == class_planes.premium ? "bg-[#800020] text-white" : plan == class_planes.vip ? "bg-[#ff8c00] text-white" : plan == class_planes.basic ? "bg-[#7cfc00] text-back" : "";
}
export function fr_planesUser(plan: string): string {
  return plan == class_planes.premium ? "text-[#800020]" : plan == class_planes.vip ? "text-[#ff8c00]" : plan == class_planes.basic ? "text-[#7cfc00]" : "text-primary";
}

export function fr_planes(plan: string): string {
  return plan == class_planes.premium ? "text_l_blood_cs" : plan == class_planes.vip ? "text_l_fire_cs" : plan == class_planes.basic ? "text_l_tropical_cs" : "text_l_ocean_cs";
}

export function fr_planesPlaint(plan: string): string {
  return plan == class_planes.premium ? "text-[#800020]" : plan == class_planes.vip ? "text-[#ff8c00]" : plan == class_planes.basic ? "text-[#7cfc00]" : "text-primary";
}
