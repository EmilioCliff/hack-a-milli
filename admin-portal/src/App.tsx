import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Users from './pages/Users';
import { TableContextWrapper } from './context/TableContext';
import JobPostings from './pages/JobPostings';
import JobApplications from './pages/JobApplications';
import Registrars from './pages/Registrars';
import Auctions from './pages/Auctions';
import Merchandise from './pages/Merchandise';
import Orders from './pages/Orders';
import NewsLetters from './pages/NewsLetters';
import NewsUpdates from './pages/NewsUpdates';
import Blogs from './pages/Blogs';

const queryClient = new QueryClient();

const App = () => (
	<TableContextWrapper>
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Router>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route
							path="/reset-password/:token"
							element={<ResetPassword />}
						/>
						<Route path="/" element={<AppLayout />}>
							<Route index element={<Index />} />
							<Route path="users" element={<Users />} />
							<Route path="registrars" element={<Registrars />} />
							<Route path="auctions" element={<Auctions />} />
							<Route path="blogs" element={<Blogs />} />
							<Route
								path="news-updates"
								element={<NewsUpdates />}
							/>
							<Route
								path="news-letters"
								element={<NewsLetters />}
							/>
							<Route path="orders" element={<Orders />} />
							<Route
								path="merchandise"
								element={<Merchandise />}
							/>
							<Route
								path="job-postings"
								element={<JobPostings />}
							/>
							<Route
								path="job-applications"
								element={<JobApplications />}
							/>
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</Router>
				<ToastContainer />
			</TooltipProvider>
		</QueryClientProvider>
	</TableContextWrapper>
);

export default App;
