// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session } from '$services/types';

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
