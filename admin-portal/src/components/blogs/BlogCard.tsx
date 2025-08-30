import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Clock, Edit, Eye, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';

function BlogCard({ blog }: { blog: any }) {
	return (
		<Card
			key={blog.id}
			className="shadow-soft hover:shadow-medium transition-shadow"
		>
			<CardHeader className="p-0">
				<div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden">
					{/* Placeholder for blog cover image */}
					<div className="absolute inset-0 bg-gradient-to-br from-kenic-teal to-kenic-teal-light"></div>
					<div className="relative z-10 text-white text-center p-4">
						<h4 className="font-semibold text-sm">{blog.topic}</h4>
					</div>
					<Badge
						// className={`absolute top-3 right-3 ${statusBadge.color}`}
						className={`absolute top-3 right-3`}
					>
						{blog.status}
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
						<span>{blog.minReadTime} min read</span>
					</div>

					<h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
						{blog.title}
					</h3>

					<p className="text-sm text-muted-foreground line-clamp-3">
						{blog.excerpt}
					</p>

					<div className="flex items-center justify-between pt-2 border-t border-border">
						<div className="text-xs text-muted-foreground">
							{format(blog.publishedAt, 'ppp')}
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
