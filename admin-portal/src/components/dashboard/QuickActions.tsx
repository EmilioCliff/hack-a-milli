import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	UserPlus,
	Store,
	Gavel,
	FileText,
	Calendar,
	Settings,
} from 'lucide-react';

const actions = [
	{
		title: 'Add New User',
		description: 'Create a new user account',
		icon: UserPlus,
		href: '/users',
	},
	{
		title: 'Register Registrar',
		description: 'Add a new domain registrar',
		icon: Store,
		href: '/registrars',
	},
	{
		title: 'Create Auction',
		description: 'Start a new domain auction',
		icon: Gavel,
		href: '/auctions',
	},
	{
		title: 'Publish Article',
		description: 'Write and publish a blog post',
		icon: FileText,
		href: '/content',
	},
	{
		title: 'Schedule Event',
		description: 'Create a new event',
		icon: Calendar,
		href: '/events',
	},
	{
		title: 'System Settings',
		description: 'Configure system preferences',
		icon: Settings,
		href: '/settings',
	},
];

export function QuickActions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-foreground">Quick Actions</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{actions.map((action, index) => (
					<Button
						key={index}
						variant="outline"
						className="h-auto hover:bg-primary p-4 flex flex-col items-start gap-2 text-left hover:shadow-elegant transition-all duration-300"
						asChild
					>
						<a href={action.href}>
							<div className="flex items-center gap-2 w-full">
								<action.icon className="w-5 h-5 text-accent hover:text-white" />
								<span className="font-medium">
									{action.title}
								</span>
							</div>
							<span className="text-sm text-muted-foreground">
								{action.description}
							</span>
						</a>
					</Button>
				))}
			</CardContent>
		</Card>
	);
}
