import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
	children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full bg-background">
				<Sidebar />
				<div className="flex-1 flex flex-col">
					<Topbar />
					<main className="flex-1 overflow-auto">{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
