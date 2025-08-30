import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const upcomingEvents = [
	{ name: 'KENIC Summit 2024', date: '2024-03-15', attendees: 250 },
	{ name: 'Domain Security Workshop', date: '2024-03-22', attendees: 80 },
	{ name: 'Registrar Training', date: '2024-04-05', attendees: 45 },
];

function UpcomingEvents() {
	return (
		<Card className="shadow-soft">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					Upcoming Events
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{upcomingEvents.map((event, index) => (
						<div
							key={index}
							className="border-l-4  border-l-kenic-red pl-3 py-2"
						>
							<div className="font-medium text-sm">
								{event.name}
							</div>
							<div className="text-xs text-muted-foreground">
								{new Date(event.date).toLocaleDateString()} •{' '}
								{event.attendees} attendees
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default UpcomingEvents;
