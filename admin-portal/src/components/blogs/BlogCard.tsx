import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Clock, Edit, Eye, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Blog } from './BlogSchema';

function BlogCard({ blog }: { blog: Blog }) {
	const statusBadge = getStatusBadge(blog.published ? 'published' : 'draft');
	return (
		<Card
			key={blog.id}
			className="shadow-soft hover:shadow-medium transition-shadow"
		>
			<CardHeader className="p-0">
				<div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden">
					{/* Placeholder for blog cover image */}
					<div className="absolute inset-0 bg-gradient-to-br from-kenic-teal to-kenic-teal-light">
						<img
							src={blog.cover_img}
							alt={blog.title}
							className="w-full h-full object-cover"
						/>
					</div>
					<Badge
						className={`absolute top-3 font-semibold right-3 ${statusBadge.color}`}
					>
						{blog.published ? 'Published' : 'Draft'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-4">
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<User className="h-3 w-3" />
						<span>{blog.author}</span>
						<span>•</span>
						<Clock className="h-3 w-3" />
						<span>{blog.min_read} min read</span>
					</div>

					<div>
						<h4 className="font-extralight text-xs text-accent uppercase">
							{blog.topic}
						</h4>

						<h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
							{blog.title}
						</h3>
					</div>

					<p className="text-sm text-muted-foreground line-clamp-3">
						{blog.description}
					</p>

					<div className="flex items-center justify-between pt-2 border-t border-border">
						<div className="text-xs text-muted-foreground">
							{blog.published_at
								? format(blog.published_at, 'ppp')
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

export default BlogCard;

const getStatusBadge = (status: string) => {
	const variants = {
		published: 'outline',
		draft: 'secondary',
		review: 'outline',
	} as const;

	const colors = {
		published: 'bg-green-800/60 text-white',
		draft: 'bg-muted text-muted-foreground',
		review: 'bg-warning text-warning-foreground',
	} as const;

	return {
		variant: variants[status as keyof typeof variants],
		color: colors[status as keyof typeof colors],
	};
};
