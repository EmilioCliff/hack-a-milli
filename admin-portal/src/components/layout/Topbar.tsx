import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AppBreadcrumb from './AppBreadcrumb';

export function Topbar() {
	return (
		<header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
			<div className="flex items-center justify-between h-full px-6">
				<div className="flex items-center gap-4">
					<SidebarTrigger className="text-foreground hover:bg-muted hover:text-accent" />
					<AppBreadcrumb />
				</div>

				<div className="flex items-center gap-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="flex items-center gap-2 hover:bg-muted"
							>
								<Avatar className="w-8 h-8">
									<AvatarImage src="/placeholder-avatar.jpg" />
									<AvatarFallback className="bg-primary text-primary-foreground">
										JD
									</AvatarFallback>
								</Avatar>
								<div className="hidden md:block text-left">
									<p className="text-sm text-primary font-medium">
										John Doe
									</p>
									<p className="text-xs text-muted-foreground">
										Administrator
									</p>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="w-4 h-4 mr-2" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-destructive">
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
