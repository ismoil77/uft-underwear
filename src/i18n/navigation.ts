import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// ╔════════════════════════════════════════════════════════════════╗
// ║               НАВИГАЦИЯ С ЛОКАЛИЗАЦИЕЙ                         ║
// ║    Используй эти компоненты вместо next/link и next/navigation ║
// ╚════════════════════════════════════════════════════════════════╝

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
