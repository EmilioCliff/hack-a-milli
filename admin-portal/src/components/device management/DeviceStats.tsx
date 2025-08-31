import { Smartphone, Monitor, Bell } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const stats = [
	{
		label: 'Total Devices',
		value: 4,
		icon: Smartphone,
		iconClass: 'text-primary',
		subLabel: 'Registered devices',
	},
	{
		label: 'Active Devices',
		value: 448,
		icon: Bell,
		iconClass: 'text-accent',
		subLabel: 'Can receive notifications',
	},
	{
		label: 'Recently Used',
		value: 0,
		icon: Smartphone,
		iconClass: 'text-primary',
		subLabel: 'Used in last 24h',
	},
	{
		label: 'Platforms',
		value: 149,
		icon: Monitor,
		iconClass: 'text-orange-500',
		subLabel: 'Different platforms',
	},
];

function DeviceStats() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			{stats.map((stat, i) => {
				return (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{stat.label}
									</p>
									<p className="text-2xl font-bold text-foreground mt-2">
										{stat.value}
									</p>
									<p className="text-xs text-muted-foreground">
										{stat.subLabel}
									</p>
								</div>
								<stat.icon
									className={`w-8 h-8 ${stat.iconClass}`}
								/>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

export default DeviceStats;
