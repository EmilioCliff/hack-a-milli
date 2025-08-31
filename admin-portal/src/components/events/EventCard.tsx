import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, Eye, Tag, Trash2 } from 'lucide-react';
import { Event } from './EventSchema';
import { format } from 'date-fns';
import { Button } from '../ui/button';

type EventCardProps = {
	blog: Event;
};

export default function EventCard(blog: EventCardProps) {
	const statusBadge = getStatusBadge(blog.blog.status);
	return (
		<Card className="w-full max-w-md rounded-2xl shadow-md overflow-hidden">
			<div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-kenic-teal to-kenic-teal-light">
					<img
						src={blog.blog.cover_img}
						alt={blog.blog.title}
						className="w-full h-full object-cover"
					/>
				</div>
				<Badge
					className={`absolute top-3 font-semibold right-3 ${statusBadge.color}`}
				>
					{blog.blog.status === 'upcoming'
						? 'Upcoming'
						: blog.blog.status === 'live'
						? 'Live'
						: 'Completed'}
				</Badge>
			</div>

			<CardContent className="space-y-3">
				<div className="mt-4">
					<h4 className="font-extralight text-xs text-accent uppercase">
						{blog.blog.topic}
					</h4>

					<h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
						{blog.blog.title}
					</h3>
				</div>
				<div className="flex flex-col gap-1 text-sm text-gray-600">
					<div className="flex items-center gap-2">
						<Calendar size={14} />
						{new Date(
							blog.blog.start_time,
						).toLocaleDateString()} -{' '}
						{new Date(blog.blog.end_time).toLocaleDateString()}
					</div>
					<div className="flex items-center gap-2">
						<Clock size={14} />
						{new Date(blog.blog.start_time).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}{' '}
						-{' '}
						{new Date(blog.blog.end_time).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</div>
					<div className="flex items-center gap-2">
						<Tag size={14} /> {blog.blog.price}
					</div>
					<div className="flex items-center justify-between pt-2 border-t border-border">
						<div className="text-xs text-muted-foreground">
							{blog.blog.published_at
								? format(blog.blog.published_at, 'ppp')
								: 'Unpublished'}
						</div>
						<div className="flex gap-1">
							<Button variant="ghost" size="sm">
								<Eye className="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="sm">
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-destructive hover:text-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

const getStatusBadge = (status: string) => {
	const variants = {
		upcoming: 'outline',
		live: 'secondary',
		completed: 'outline',
	} as const;

	const colors = {
		upcoming: 'bg-green-800/60 text-white',
		live: 'bg-muted text-muted-foreground',
		completed: 'bg-red-600/80 text-white',
	} as const;

	return {
		variant: variants[status as keyof typeof variants],
		color: colors[status as keyof typeof colors],
	};
};
