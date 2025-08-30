import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="text-center">
				<h1 className="text-7xl font-bold mb-4">404</h1>
				<p className="text-xl text-gray-600 mb-4">
					Oops! Page not found
				</p>
				<p>
					The page you're looking for doesn't exist or has been moved
					<br />
					moved to a different location
				</p>
				<div className="mt-6 flex justify-center gap-4">
					<Link to={'/'}>
						<Button className="w-[150px]" variant={'outline'}>
							<ArrowLeft />
							<p>Go Back</p>
						</Button>
					</Link>
					<Link to={'/'}>
						<Button className="w-[150px]">
							<Home />
							<p>Home</p>
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
