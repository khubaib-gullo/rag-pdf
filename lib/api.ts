const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UploadResponse {
	session_id: string;
	filename: string;
	total_chunks: number;
	message: string;
}

export interface Source {
	page: number;
	chunk_index: number;
	chunk_preview: string;
}

export interface AskResponse {
	session_id: string;
	question: string;
	answer: string;
	sources: Source[];
	model_used: string;
}

export interface SessionInfo {
	session_id: string;
	filename: string;
	total_chunks: number;
	status: string;
}

export interface HealthResponse {
	status: string;
	sessions_active: number;
	cohere_key_set: boolean;
	groq_key_set: boolean;
}

export interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources?: Source[];
	model_used?: string;
	timestamp: Date;
	isLoading?: boolean;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, options);
	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: res.statusText }));
		throw new Error(err.detail || `Request failed: ${res.status}`);
	}
	return res.json();
}

export const api = {
	health: () => apiFetch<HealthResponse>("/health"),

	upload: async (file: File): Promise<UploadResponse> => {
		const form = new FormData();
		form.append("file", file);
		return apiFetch<UploadResponse>("/upload", { method: "POST", body: form });
	},

	ask: (
		session_id: string,
		question: string,
		top_k = 5,
	): Promise<AskResponse> =>
		apiFetch<AskResponse>("/ask", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ session_id, question, top_k }),
		}),

	getSession: (session_id: string) =>
		apiFetch<SessionInfo>(`/session/${session_id}`),

	deleteSession: (session_id: string) =>
		apiFetch<{ message: string }>(`/session/${session_id}`, {
			method: "DELETE",
		}),
};
