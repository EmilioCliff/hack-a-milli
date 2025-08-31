import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const events = [
	{
		id: 1,
		title: 'KENIC Annual Summit',
		topic: 'Domain Innovation',
		content:
			'Join us for the annual summit focused on the future of domain management and innovation.',
		cover_img: 'https://picsum.photos/500/300',
		start_time: '2025-09-10T09:00:00+03:00',
		end_time: '2025-09-10T17:00:00+03:00',
		status: 'live',
		venue: {
			type: 'physical',
			address: 'Nairobi Conference Center',
		},
		price: 'free',
		agenda: [
			{ time: '09:00', title: 'Opening Keynote', speaker: 'Jane Doe' },
			{
				time: '10:30',
				title: 'Panel: Future of .ke',
				speaker: 'John Smith',
			},
		],
		tags: ['summit', 'innovation', 'kenic'],
		organizers: [
			{
				name: 'KENIC',
				logo_url: 'https://example.com/logos/kenic.png',
				website: 'https://kenic.or.ke',
				email: 'info@kenic.or.ke',
				phone_number: '+254700000001',
			},
		],
		partners: [],
		speakers: [
			{
				name: 'Jane Doe',
				title: 'CEO',
				organization: 'KENIC',
				bio: 'Jane is the CEO of KENIC and a leader in domain innovation.',
				avatar_url: 'https://example.com/avatars/jane.jpg',
				linked_in_url: 'https://linkedin.com/in/janedoe',
			},
			{
				name: 'John Smith',
				title: 'CTO',
				organization: 'KENIC',
				bio: 'John is the CTO of KENIC, passionate about technology.',
				avatar_url: 'https://example.com/avatars/john.jpg',
				linked_in_url: 'https://linkedin.com/in/johnsmith',
			},
		],
		max_attendees: 500,
		registered_attendees: 120,
		published: true,
		published_at: '2025-08-01T12:00:00+03:00',
	},
	{
		id: 2,
		title: 'Domain Security Workshop',
		topic: 'Cybersecurity',
		content:
			'A hands-on workshop on securing your domains and online presence.',
		cover_img: 'https://picsum.photos/500/300',
		start_time: '2025-10-05T10:00:00+03:00',
		end_time: '2025-10-05T15:00:00+03:00',
		status: 'completed',
		venue: {
			type: 'virtual',
			platform: 'Zoom',
			meeting_id: '123456789',
			passcode: 'secure2025',
			event_link: 'https://zoom.us/j/123456789',
		},
		price: 'KES 500',
		agenda: [
			{
				time: '10:00',
				title: 'Introduction to Domain Security',
				speaker: 'Alice Kim',
			},
			{ time: '12:00', title: 'Live Demo', speaker: 'Bob Lee' },
		],
		tags: ['security', 'workshop'],
		organizers: [
			{
				name: 'KENIC Security',
				logo_url: 'https://example.com/logos/security.png',
				website: 'https://kenic.or.ke/security',
				email: 'security@kenic.or.ke',
				phone_number: '+254700000002',
			},
		],
		partners: [],
		speakers: [
			{
				name: 'Alice Kim',
				title: 'Security Lead',
				organization: 'KENIC Security',
				bio: 'Alice leads the security team at KENIC.',
				avatar_url: 'https://example.com/avatars/alice.jpg',
				linked_in_url: 'https://linkedin.com/in/alicekim',
			},
			{
				name: 'Bob Lee',
				title: 'Engineer',
				organization: 'KENIC Security',
				bio: 'Bob is a security engineer and workshop facilitator.',
				avatar_url: 'https://example.com/avatars/bob.jpg',
				linked_in_url: 'https://linkedin.com/in/boblee',
			},
		],
		max_attendees: 300,
		registered_attendees: 80,
		published: true,
		published_at: '2025-08-15T10:00:00+03:00',
	},
	{
		id: 3,
		title: 'Women in Tech Forum',
		topic: 'Diversity & Inclusion',
		content:
			'Empowering women in technology through networking and mentorship.',
		cover_img: 'https://picsum.photos/500/300',
		start_time: '2025-11-20T09:00:00+03:00',
		end_time: '2025-11-20T16:00:00+03:00',
		status: 'upcoming',
		venue: {
			type: 'physical',
			address: 'Mombasa Tech Hub',
		},
		price: 'free',
		agenda: [
			{
				time: '09:00',
				title: 'Welcome & Networking',
				speaker: 'Grace Wanjiru',
			},
			{ time: '11:00', title: 'Panel Discussion', speaker: 'Panelists' },
		],
		tags: ['women', 'tech', 'forum'],
		organizers: [
			{
				name: 'Tech Women Kenya',
				logo_url: 'https://example.com/logos/twk.png',
				website: 'https://techwomen.or.ke',
				email: 'contact@techwomen.or.ke',
				phone_number: '+254700000003',
			},
		],
		partners: [],
		speakers: [
			{
				name: 'Grace Wanjiru',
				title: 'Founder',
				organization: 'Tech Women Kenya',
				bio: 'Grace is the founder of Tech Women Kenya.',
				avatar_url: 'https://example.com/avatars/grace.jpg',
				linked_in_url: 'https://linkedin.com/in/gracewanjiru',
			},
		],
		max_attendees: 200,
		registered_attendees: 60,
		published: true,
		published_at: '2025-09-01T09:00:00+03:00',
	},
	{
		id: 4,
		title: 'Youth Coding Bootcamp',
		topic: 'Programming',
		content:
			'A bootcamp for youth to learn coding and build real-world projects.',
		cover_img: 'https://picsum.photos/500/300',
		start_time: '2025-12-01T08:00:00+03:00',
		end_time: '2025-12-05T17:00:00+03:00',
		status: 'upcoming',
		venue: {
			type: 'physical',
			address: 'Eldoret Innovation Center',
		},
		price: 'KES 1000',
		agenda: [
			{
				time: '08:00',
				title: 'Introduction to Coding',
				speaker: 'David Otieno',
			},
			{ time: '14:00', title: 'Project Work', speaker: 'Mentors' },
		],
		tags: ['youth', 'coding', 'bootcamp'],
		organizers: [
			{
				name: 'KENIC Youth',
				logo_url: 'https://example.com/logos/youth.png',
				website: 'https://kenic.or.ke/youth',
				email: 'youth@kenic.or.ke',
				phone_number: '+254700000004',
			},
		],
		partners: [],
		speakers: [
			{
				name: 'David Otieno',
				title: 'Lead Mentor',
				organization: 'KENIC Youth',
				bio: 'David mentors youth in coding and tech.',
				avatar_url: 'https://example.com/avatars/david.jpg',
				linked_in_url: 'https://linkedin.com/in/davidotieno',
			},
		],
		max_attendees: 100,
		registered_attendees: 40,
		published: true,
		published_at: '2025-10-01T08:00:00+03:00',
	},
	{
		id: 5,
		title: 'Digital Marketing Seminar',
		topic: 'Marketing',
		content:
			'Learn the latest trends in digital marketing from industry experts.',
		cover_img: 'https://picsum.photos/500/300',
		start_time: '2025-09-25T09:00:00+03:00',
		end_time: '2025-09-25T13:00:00+03:00',
		status: 'upcoming',
		venue: {
			type: 'virtual',
			platform: 'Google Meet',
			meeting_id: 'meet123',
			passcode: 'dm2025',
			event_link: 'https://meet.google.com/meet123',
		},
		price: 'KES 800',
		agenda: [
			{ time: '09:00', title: 'SEO Strategies', speaker: 'Linda Mwangi' },
			{
				time: '11:00',
				title: 'Social Media Marketing',
				speaker: 'Peter Kariuki',
			},
		],
		tags: ['marketing', 'digital'],
		organizers: [
			{
				name: 'KENIC Marketing',
				logo_url: 'https://example.com/logos/marketing.png',
				website: 'https://kenic.or.ke/marketing',
				email: 'marketing@kenic.or.ke',
				phone_number: '+254700000005',
			},
		],
		partners: [],
		speakers: [
			{
				name: 'Linda Mwangi',
				title: 'Marketing Specialist',
				organization: 'KENIC Marketing',
				bio: 'Linda specializes in SEO and digital campaigns.',
				avatar_url: 'https://example.com/avatars/linda.jpg',
				linked_in_url: 'https://linkedin.com/in/lindamwangi',
			},
			{
				name: 'Peter Kariuki',
				title: 'Social Media Lead',
				organization: 'KENIC Marketing',
				bio: 'Peter leads social media strategy.',
				avatar_url: 'https://example.com/avatars/peter.jpg',
				linked_in_url: 'https://linkedin.com/in/peterkariuki',
			},
		],
		max_attendees: 250,
		registered_attendees: 90,
		published: true,
		published_at: '2025-08-20T09:00:00+03:00',
	},
	{
		id: 6,
		title: 'Startup Pitch Night',
		topic: 'Entrepreneurship',
		content: 'Pitch your startup idea to investors and industry leaders.',
		cover_img: 'https://picsum.photos/500/300',
		start_time: '2025-10-15T18:00:00+03:00',
		end_time: '2025-10-15T21:00:00+03:00',
		status: 'upcoming',
		venue: {
			type: 'physical',
			address: 'Nairobi Garage',
		},
		price: 'free',
		agenda: [
			{ time: '18:00', title: 'Startup Pitches', speaker: 'Various' },
			{ time: '20:00', title: 'Networking', speaker: 'All Attendees' },
		],
		tags: ['startup', 'pitch', 'networking'],
		organizers: [
			{
				name: 'KENIC Ventures',
				logo_url: 'https://example.com/logos/ventures.png',
				website: 'https://kenic.or.ke/ventures',
				email: 'ventures@kenic.or.ke',
				phone_number: '+254700000006',
			},
		],
		partners: [],
		speakers: [
			{
				name: 'Samuel Njoroge',
				title: 'Investor',
				organization: 'KENIC Ventures',
				bio: 'Samuel invests in promising startups.',
				avatar_url: 'https://example.com/avatars/samuel.jpg',
				linked_in_url: 'https://linkedin.com/in/samuelnjoroge',
			},
		],
		max_attendees: 150,
		registered_attendees: 50,
		published: true,
		published_at: '2025-09-10T18:00:00+03:00',
	},
];

function Events() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [isFiltered, setIsFiltered] = useState(false);
	return (
		<div className="space-y-6 p-4 min-h-full bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Events
					</h1>
					<p className="text-muted-foreground">
						Manage conferences, workshops, and training sessions
					</p>
				</div>
				<Button className="gradient-primary cursor-pointer hover:accent-hover shadow-glow">
					<Plus className="w-4 h-4 mr-2" />
					Write New Blog
				</Button>
			</div>

			<Card>
				<CardContent className="p-6">
					<div className="flex gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
							<Input
								placeholder="Filter by title or topic"
								value={search}
								onChange={(event) => {
									setSearch(event.target.value);
									setIsFiltered(
										event.target.value.length > 0,
									);
								}}
								className="pl-10"
							/>
						</div>

						<Select
							value={selectedStatus}
							onValueChange={(value) => {
								setSelectedStatus(value);
								setIsFiltered(value !== 'all');
							}}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="all">Both</SelectItem>
									<SelectItem value="published">
										Published
									</SelectItem>
									<SelectItem value="draft">Draft</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						{isFiltered && (
							<Button
								variant="ghost"
								onClick={() => {
									setSearch('');
									setSelectedStatus('all');
									setIsFiltered(false);
								}}
								className="h-8 px-2 lg:px-3"
							>
								Reset
								<X />
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{events.map((event) => (
					<EventCard key={event.id} blog={event} />
				))}
			</div>

			<div className="flex justify-center mt-4">
				<Button variant="outline">Load More</Button>
			</div>
		</div>
	);
}

export default Events;
