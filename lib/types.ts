export type StatusBerkas = "AMAN" | "DIAWASI" | "DIKARANTINA" | "DIMUSNAHKAN";

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  status_berkas: StatusBerkas;
  tags: string[];
  cover_image_url: string | null;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  story_id: string;
  author_name: string;
  content: string;
  status: "pending" | "approved" | "spam";
  created_at: string;
}

export interface Rating {
  id: string;
  story_id: string;
  value: number;
  voter_hash: string;
  created_at: string;
}

export const STATUS_BERKAS_LABEL: Record<StatusBerkas, { label: string; desc: string }> = {
  AMAN: { label: "AMAN", desc: "Bisa dijelaskan, relatif tidak berbahaya" },
  DIAWASI: { label: "DIAWASI", desc: "Perlu pemantauan berkala" },
  DIKARANTINA: { label: "DIKARANTINA", desc: "Ditahan, akses dibatasi" },
  DIMUSNAHKAN: { label: "DIMUSNAHKAN", desc: "Upaya pemusnahan pernah/sedang dilakukan" },
};
