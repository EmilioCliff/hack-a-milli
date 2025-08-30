import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Link, useLocation } from 'react-router-dom';

function AppBreadcrumb() {
	const pathname = useLocation();

	// Split the current path into parts: "/dashboard/users/123"
	const parts = pathname.pathname.split('/').filter(Boolean);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/">Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{parts.map((part, index) => {
					const href = '/' + parts.slice(0, index + 1).join('/');
					const isLast = index === parts.length - 1;

					return (
						<div key={href} className="flex items-center">
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="capitalize">
										{part}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={href} className="capitalize">
											{part}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</div>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default AppBreadcrumb;
