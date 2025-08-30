import {
	Home,
	Users,
	Shield,
	Building2,
	Store,
	Gavel,
	FileText,
	Calendar,
	Briefcase,
	Settings,
	Newspaper,
} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
	Sidebar as SidebarComponent,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
	useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuGroups = [
	{
		title: 'Main',
		items: [{ title: 'Dashboard', url: '/', icon: Home }],
	},
	{
		title: 'Management',
		items: [
			{ title: 'User Management', url: '/users', icon: Users },
			{ title: 'Departments', url: '/departments', icon: Building2 },
			{ title: 'Roles & Permissions', url: '/roles', icon: Shield },
		],
	},
	{
		title: 'Content',
		items: [
			{ title: 'Events', url: '/events', icon: Calendar },
			{ title: 'Blogs', url: '/blogs', icon: FileText },
			{ title: 'News Updates', url: '/news-updates', icon: FileText },
			{
				title: 'Newsletters',
				url: '/news-letters',
				icon: Newspaper,
			},
		],
	},
	{
		title: 'Domain',
		items: [
			{ title: 'Registrars', url: '/registrars', icon: Store },
			{ title: 'Domain Auctions', url: '/auctions', icon: Gavel },
		],
	},
	{
		title: 'Merchandise',
		items: [
			{ title: 'Products', url: '/merchandise', icon: Calendar },
			{ title: 'Orders', url: '/orders', icon: FileText },
		],
	},
	{
		title: 'Careers',
		items: [
			{ title: 'Job Postings', url: '/job-postings', icon: Calendar },
			{
				title: 'Job Applications',
				url: '/job-applications',
				icon: FileText,
			},
		],
	},
	{
		title: 'System',
		items: [
			{
				title: 'Device Management',
				url: '/device-management',
				icon: Briefcase,
			},
			{ title: 'Documents', url: '/documents', icon: Settings },
			{ title: 'Audit Logs', url: '/audit-logs', icon: Settings },
		],
	},
];

export function Sidebar() {
	const { state } = useSidebar();
	const location = useLocation();
	const collapsed = state === 'collapsed';

	const isActive = (path: string) => {
		if (path === '/') return location.pathname === '/';
		return location.pathname.startsWith(path);
	};

	return (
		<SidebarComponent
			className={cn(
				'border-r border-sidebar-border transition-all duration-300',
				collapsed ? 'w-16' : 'w-64',
			)}
		>
			<SidebarHeader className="border-b border-sidebar-border p-4">
				<div className="flex items-center gap-3">
					<Link className="flex gap-4 items-center" to="/">
						<div className="w-14 h-14 p-1 bg-white rounded-full flex items-center justify-center">
							<img
								className="object-contain"
								src="/kenic_logo.png"
								alt=""
							/>
						</div>
						{!collapsed && (
							<div>
								<h1 className="text-lg font-bold text-sidebar-foreground">
									KENIC
								</h1>
								<p className="text-xs text-sidebar-foreground/70">
									Admin Portal
								</p>
							</div>
						)}
					</Link>
				</div>
			</SidebarHeader>

			<SidebarContent className="pb-10">
				{menuGroups.map((group) => (
					<SidebarGroup className="py-0" key={group.title}>
						{!collapsed && (
							<SidebarGroupLabel className="text-sidebar-foreground/60 px-4 py-2">
								{group.title}
							</SidebarGroupLabel>
						)}
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<NavLink
												to={item.url}
												className={cn(
													'flex items-center gap-3 px-4 rounded-lg transition-all duration-200',
													'hover:bg-sidebar-accent text-sidebar-foreground',
													isActive(item.url) &&
														'bg-accent text-sidebar-primary shadow-glow',
												)}
											>
												<item.icon className="w-5 h-5 flex-shrink-0" />
												{!collapsed && (
													<span className="flex-1 text-sm font-medium">
														{item.title}
													</span>
												)}
											</NavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</SidebarComponent>
	);
}
