import DashboardStats from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivities';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';

const Index = () => {
	return (
		<div className="space-y-6 p-4">
			<div className="gradient-primary text-primary-foreground p-6 rounded-lg shadow-elegant">
				<h1 className="text-3xl font-bold mb-2">
					Welcome to KENIC Admin Portal
				</h1>
				<p className="text-primary-foreground/90 text-lg">
					Manage Kenya's .ke domain ecosystem with comprehensive
					administrative tools. <br />
					Monitor registrars, oversee domain registrations, and
					maintain the trustedbr <br /> internet infrastructure for
					all Kenyans.
				</p>
			</div>

			<DashboardStats />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<RecentActivity />
				</div>
				<div>
					<UpcomingEvents />
				</div>
			</div>

			<QuickActions />
		</div>
	);
};

export default Index;
