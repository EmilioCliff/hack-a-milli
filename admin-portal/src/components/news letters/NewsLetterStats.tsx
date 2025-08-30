import { Card, CardContent } from '@/components/ui/card';
import { Mail, Download, FileText, ArrowDown } from 'lucide-react';

const stats = [
	{
		label: 'Total Newsletters',
		value: 4,
		icon: Mail,
		iconClass: 'text-primary',
		subLabel: '3 published',
	},
	{
		label: 'Total Downloads',
		value: 448,
		icon: Download,
		iconClass: 'text-accent',
		subLabel: 'All time downloads',
	},
	{
		label: 'Latest Issue',
		value: '#24',
		icon: FileText,
		iconClass: 'text-primary',
		subLabel: 'Issue number',
	},
	{
		label: 'Avg. Downloads',
		value: 149,
		icon: ArrowDown,
		iconClass: 'text-orange-500',
		subLabel: 'Per newsletter',
	},
];

function NewsLetterStats() {
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

export default NewsLetterStats;
