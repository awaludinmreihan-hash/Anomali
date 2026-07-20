import { StatusBerkas, STATUS_BERKAS_LABEL } from "@/lib/types";

const COLOR: Record<StatusBerkas, string> = {
  AMAN: "text-emerald-800",
  DIAWASI: "text-darurat",
  DIKARANTINA: "text-stempel",
  DIMUSNAHKAN: "text-stempel-dark",
};

export default function StempelBadge({ status, size = "sm" }: { status: StatusBerkas; size?: "sm" | "lg" }) {
  return (
    <span
      className={`stempel ${COLOR[status]} ${size === "lg" ? "text-base px-3 py-1" : "text-[11px]"}`}
      title={STATUS_BERKAS_LABEL[status].desc}
    >
      {STATUS_BERKAS_LABEL[status].label}
    </span>
  );
}
