import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const activities = [
	{
		id: 1,
		user: {
			name: 'Sarah Kimani',
			email: 's.kimani@example.ke',
			avatar: '/placeholder-avatar.jpg',
		},
		action: 'Registered domain',
		target: 'techstartup.ke',
		time: '2 minutes ago',
		status: 'success',
	},
	{
		id: 2,
		user: {
			name: 'David Ochieng',
			email: 'd.ochieng@registrar.ke',
			avatar: '/placeholder-avatar.jpg',
		},
		action: 'Updated registrar info',
		target: 'Contact details',
		time: '15 minutes ago',
		status: 'info',
	},
	{
		id: 3,
		user: {
			name: 'Mary Wanjiku',
			email: 'm.wanjiku@auction.ke',
			avatar: '/placeholder-avatar.jpg',
		},
		action: 'Placed bid on',
		target: 'premium.ke',
		time: '1 hour ago',
		status: 'warning',
	},
	{
		id: 4,
		user: {
			name: 'James Mwangi',
			email: 'j.mwangi@corp.ke',
			avatar: '/placeholder-avatar.jpg',
		},
		action: 'Applied for registrar',
		target: 'New application',
		time: '3 hours ago',
		status: 'pending',
	},
	{
		id: 5,
		user: {
			name: 'Grace Akinyi',
			email: 'g.akinyi@news.ke',
			avatar: '/placeholder-avatar.jpg',
		},
		action: 'Published article',
		target: '.ke Domain Guidelines',
		time: '5 hours ago',
		status: 'success',
	},
];

const getStatusColor = (status: string) => {
	switch (status) {
		case 'success':
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
		case 'warning':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
		case 'info':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
		case 'pending':
			return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
	}
};

export function RecentActivity() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-foreground">
					Recent Activity
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{activities.map((activity) => (
					<div
						key={activity.id}
						className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
					>
						<Avatar className="w-10 h-10">
							<AvatarImage src={activity.user.avatar} />
							<AvatarFallback className="bg-primary text-primary-foreground">
								{activity.user.name
									.split(' ')
									.map((n) => n[0])
									.join('')}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1 space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-medium text-foreground">
									{activity.user.name}
								</span>
								<Badge
									variant="outline"
									className={getStatusColor(activity.status)}
								>
									{activity.status}
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								{activity.action}{' '}
								<span className="font-medium text-accent">
									{activity.target}
								</span>
							</p>
							<p className="text-xs text-muted-foreground">
								{activity.time}
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
