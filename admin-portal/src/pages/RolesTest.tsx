import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
	Shield,
	Plus,
	Edit,
	Trash2,
	Users,
	Key,
	Settings,
	Search,
	Crown,
	UserCheck,
	Eye,
	CheckCircle2,
	XCircle,
	AlertTriangle,
	Zap,
} from 'lucide-react';

// Enhanced mock data with more realistic structure
const mockResources = [
	{
		id: 1,
		name: 'users',
		displayName: 'User Management',
		description: 'Manage system users, profiles, and authentication',
		category: 'Core',
		icon: '👥',
		riskLevel: 'high',
	},
	{
		id: 2,
		name: 'blogs',
		displayName: 'Blog Management',
		description: 'Create, edit, and publish blog content',
		category: 'Content',
		icon: '📝',
		riskLevel: 'medium',
	},
	{
		id: 3,
		name: 'events',
		displayName: 'Event Management',
		description: 'Organize and manage events and conferences',
		category: 'Content',
		icon: '📅',
		riskLevel: 'low',
	},
	{
		id: 4,
		name: 'registrars',
		displayName: 'Registrar Management',
		description: 'Manage domain registrars and partnerships',
		category: 'Business',
		icon: '🏢',
		riskLevel: 'high',
	},
	{
		id: 5,
		name: 'domains',
		displayName: 'Domain Registry',
		description: 'Manage .ke domain registrations and transfers',
		category: 'Core',
		icon: '🌐',
		riskLevel: 'critical',
	},
	{
		id: 6,
		name: 'auctions',
		displayName: 'Domain Auctions',
		description: 'Manage premium domain auctions and bidding',
		category: 'Business',
		icon: '⚡',
		riskLevel: 'medium',
	},
	{
		id: 7,
		name: 'analytics',
		displayName: 'Analytics & Reports',
		description: 'Access system analytics and generate reports',
		category: 'Insights',
		icon: '📊',
		riskLevel: 'low',
	},
	{
		id: 8,
		name: 'security',
		displayName: 'Security Settings',
		description: 'Configure security policies and audit logs',
		category: 'Security',
		icon: '🔒',
		riskLevel: 'critical',
	},
];

const mockActions = [
	{
		id: 1,
		name: 'create',
		displayName: 'Create',
		description: 'Create new records',
		icon: '➕',
		color: 'bg-green-100 text-green-800',
	},
	{
		id: 2,
		name: 'read:any',
		displayName: 'View All',
		description: 'View any record',
		icon: '👁️',
		color: 'bg-blue-100 text-blue-800',
	},
	{
		id: 3,
		name: 'read:own',
		displayName: 'View Own',
		description: 'View only own records',
		icon: '👤',
		color: 'bg-cyan-100 text-cyan-800',
	},
	{
		id: 4,
		name: 'update:any',
		displayName: 'Edit All',
		description: 'Edit any record',
		icon: '✏️',
		color: 'bg-yellow-100 text-yellow-800',
	},
	{
		id: 5,
		name: 'update:own',
		displayName: 'Edit Own',
		description: 'Edit only own records',
		icon: '📝',
		color: 'bg-orange-100 text-orange-800',
	},
	{
		id: 6,
		name: 'delete',
		displayName: 'Delete',
		description: 'Delete records',
		icon: '🗑️',
		color: 'bg-red-100 text-red-800',
	},
	{
		id: 7,
		name: 'publish',
		displayName: 'Publish',
		description: 'Publish/unpublish content',
		icon: '📢',
		color: 'bg-purple-100 text-purple-800',
	},
	{
		id: 8,
		name: 'approve',
		displayName: 'Approve',
		description: 'Approve submissions',
		icon: '✅',
		color: 'bg-emerald-100 text-emerald-800',
	},
];

const mockRoles = [
	{
		id: 1,
		name: 'Super Administrator',
		slug: 'super_admin',
		description: 'Complete system access with all permissions',
		isSystemRole: true,
		isActive: true,
		userCount: 2,
		permissions: [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
			20,
		],
		riskLevel: 'critical',
		createdAt: '2024-01-01',
		lastModified: '2024-12-01',
	},
	{
		id: 2,
		name: 'Content Manager',
		slug: 'content_manager',
		description: 'Manage blogs, news, events, and website content',
		isSystemRole: false,
		isActive: true,
		userCount: 8,
		permissions: [2, 3, 7, 8, 9, 14, 15, 16],
		riskLevel: 'medium',
		createdAt: '2024-02-15',
		lastModified: '2024-11-20',
	},
	{
		id: 3,
		name: 'Registrar Coordinator',
		slug: 'registrar_coordinator',
		description: 'Manage registrar relationships and applications',
		isSystemRole: false,
		isActive: true,
		userCount: 5,
		permissions: [4, 5, 6, 10, 11, 12],
		riskLevel: 'high',
		createdAt: '2024-03-10',
		lastModified: '2024-12-05',
	},
	{
		id: 4,
		name: 'Analytics Viewer',
		slug: 'analytics_viewer',
		description: 'Read-only access to analytics and reports',
		isSystemRole: false,
		isActive: true,
		userCount: 12,
		permissions: [17, 18],
		riskLevel: 'low',
		createdAt: '2024-04-20',
		lastModified: '2024-10-15',
	},
	{
		id: 5,
		name: 'Guest User',
		slug: 'guest',
		description: 'Limited read-only access for external users',
		isSystemRole: true,
		isActive: false,
		userCount: 0,
		permissions: [2, 8, 14],
		riskLevel: 'low',
		createdAt: '2024-01-01',
		lastModified: '2024-09-30',
	},
];

export default function RBACPage() {
	const [roles, setRoles] = useState(mockRoles);
	const [selectedRole, setSelectedRole] = useState<
		(typeof mockRoles)[0] | null
	>(null);
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedCategory, setSelectedCategory] = useState('all');

	const [newRole, setNewRole] = useState({
		name: '',
		description: '',
		permissions: [] as number[],
		riskLevel: 'low' as 'low' | 'medium' | 'high' | 'critical',
	});

	const handleCreateRole = () => {
		if (newRole.name && newRole.description) {
			const role = {
				id: Math.max(...roles.map((r) => r.id)) + 1,
				name: newRole.name,
				slug: newRole.name.toLowerCase().replace(/\s+/g, '_'),
				description: newRole.description,
				isSystemRole: false,
				isActive: true,
				userCount: 0,
				permissions: newRole.permissions,
				riskLevel: newRole.riskLevel,
				createdAt: new Date().toISOString().split('T')[0],
				lastModified: new Date().toISOString().split('T')[0],
			};
			setRoles([...roles, role]);
			setNewRole({
				name: '',
				description: '',
				permissions: [],
				riskLevel: 'low',
			});
			setIsRoleDialogOpen(false);
		}
	};

	const handlePermissionToggle = (permissionId: number) => {
		setNewRole((prev) => ({
			...prev,
			permissions: prev.permissions.includes(permissionId)
				? prev.permissions.filter((p) => p !== permissionId)
				: [...prev.permissions, permissionId],
		}));
	};

	const getRiskLevelColor = (level: string) => {
		switch (level) {
			case 'critical':
				return 'bg-red-500 text-white';
			case 'high':
				return 'bg-orange-500 text-white';
			case 'medium':
				return 'bg-yellow-500 text-white';
			case 'low':
				return 'bg-green-500 text-white';
			default:
				return 'bg-gray-500 text-white';
		}
	};

	const getRiskIcon = (level: string) => {
		switch (level) {
			case 'critical':
				return <XCircle className="h-4 w-4" />;
			case 'high':
				return <AlertTriangle className="h-4 w-4" />;
			case 'medium':
				return <Eye className="h-4 w-4" />;
			case 'low':
				return <CheckCircle2 className="h-4 w-4" />;
			default:
				return <Shield className="h-4 w-4" />;
		}
	};

	const categories = [
		'all',
		...new Set(mockResources.map((r) => r.category)),
	];
	const filteredRoles = roles.filter(
		(role) =>
			role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			role.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
	const activeRoles = roles.filter((r) => r.isActive).length;
	const criticalRoles = roles.filter(
		(r) => r.riskLevel === 'critical',
	).length;

	return (
		<div className="flex flex-1 flex-col gap-6 p-6 pt-0">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-kenic-blue flex items-center gap-3">
						<Shield className="h-8 w-8" />
						Role-Based Access Control
					</h1>
					<p className="text-muted-foreground">
						Manage roles, permissions, and access control with
						precision
					</p>
				</div>
				<Dialog
					open={isRoleDialogOpen}
					onOpenChange={setIsRoleDialogOpen}
				>
					<DialogTrigger asChild>
						<Button className="bg-kenic-blue hover:bg-kenic-blue/90 shadow-lg">
							<Plus className="mr-2 h-4 w-4" />
							Create New Role
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-2xl flex items-center gap-2">
								<Zap className="h-6 w-6 text-kenic-blue" />
								Create New Role
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-8">
							{/* Basic Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label
										htmlFor="roleName"
										className="text-base font-semibold"
									>
										Role Name
									</Label>
									<Input
										id="roleName"
										placeholder="e.g., Content Manager"
										value={newRole.name}
										onChange={(e) =>
											setNewRole((prev) => ({
												...prev,
												name: e.target.value,
											}))
										}
										className="h-12"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="riskLevel"
										className="text-base font-semibold"
									>
										Risk Level
									</Label>
									<select
										id="riskLevel"
										value={newRole.riskLevel}
										onChange={(e) =>
											setNewRole((prev) => ({
												...prev,
												riskLevel: e.target
													.value as any,
											}))
										}
										className="w-full h-12 px-3 border border-input bg-background rounded-md"
									>
										<option value="low">Low Risk</option>
										<option value="medium">
											Medium Risk
										</option>
										<option value="high">High Risk</option>
										<option value="critical">
											Critical Risk
										</option>
									</select>
								</div>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="roleDescription"
									className="text-base font-semibold"
								>
									Description
								</Label>
								<Textarea
									id="roleDescription"
									placeholder="Describe the role's purpose and responsibilities..."
									value={newRole.description}
									onChange={(e) =>
										setNewRole((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									rows={3}
									className="resize-none"
								/>
							</div>

							{/* Permission Assignment */}
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<h3 className="text-xl font-bold text-kenic-blue">
										Assign Permissions
									</h3>
									<Badge
										variant="outline"
										className="text-sm"
									>
										{newRole.permissions.length} permissions
										selected
									</Badge>
								</div>

								{/* Category Filter */}
								<div className="flex flex-wrap gap-2">
									{categories.map((category) => (
										<Button
											key={category}
											variant={
												selectedCategory === category
													? 'default'
													: 'outline'
											}
											size="sm"
											onClick={() =>
												setSelectedCategory(category)
											}
											className="capitalize"
										>
											{category === 'all'
												? 'All Categories'
												: category}
										</Button>
									))}
								</div>

								{/* Permission Grid */}
								<div className="grid gap-6">
									{mockResources
										.filter(
											(resource) =>
												selectedCategory === 'all' ||
												resource.category ===
													selectedCategory,
										)
										.map((resource) => (
											<Card
												key={resource.id}
												className="border-2 hover:border-kenic-blue/30 transition-colors"
											>
												<CardHeader className="pb-4">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<span className="text-2xl">
																{resource.icon}
															</span>
															<div>
																<CardTitle className="text-lg text-kenic-blue">
																	{
																		resource.displayName
																	}
																</CardTitle>
																<p className="text-sm text-muted-foreground">
																	{
																		resource.description
																	}
																</p>
															</div>
														</div>
														<div className="flex items-center gap-2">
															<Badge
																variant="outline"
																className="capitalize"
															>
																{
																	resource.category
																}
															</Badge>
															<Badge
																className={getRiskLevelColor(
																	resource.riskLevel,
																)}
															>
																{getRiskIcon(
																	resource.riskLevel,
																)}
																{
																	resource.riskLevel
																}
															</Badge>
														</div>
													</div>
												</CardHeader>
												<CardContent>
													<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
														{mockActions.map(
															(action) => {
																const permissionId =
																	resource.id *
																		10 +
																	action.id; // Mock permission ID
																const isSelected =
																	newRole.permissions.includes(
																		permissionId,
																	);

																return (
																	<div
																		key={
																			action.id
																		}
																		className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
																			isSelected
																				? 'border-kenic-blue bg-kenic-blue/5'
																				: 'border-gray-200 hover:border-gray-300'
																		}`}
																		onClick={() =>
																			handlePermissionToggle(
																				permissionId,
																			)
																		}
																	>
																		<div className="flex items-center justify-between mb-2">
																			<span className="text-lg">
																				{
																					action.icon
																				}
																			</span>
																			<div
																				className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
																					isSelected
																						? 'bg-kenic-blue border-kenic-blue'
																						: 'border-gray-300'
																				}`}
																			>
																				{isSelected && (
																					<CheckCircle2 className="h-3 w-3 text-white" />
																				)}
																			</div>
																		</div>
																		<div className="text-sm font-medium">
																			{
																				action.displayName
																			}
																		</div>
																		<div className="text-xs text-muted-foreground">
																			{
																				action.description
																			}
																		</div>
																	</div>
																);
															},
														)}
													</div>
												</CardContent>
											</Card>
										))}
								</div>
							</div>

							<div className="flex justify-end gap-4 pt-6 border-t">
								<Button
									variant="outline"
									onClick={() => setIsRoleDialogOpen(false)}
									size="lg"
								>
									Cancel
								</Button>
								<Button
									onClick={handleCreateRole}
									className="bg-kenic-blue hover:bg-kenic-blue/90"
									size="lg"
									disabled={
										!newRole.name || !newRole.description
									}
								>
									<Plus className="mr-2 h-4 w-4" />
									Create Role
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card className="border-l-4 border-l-kenic-blue">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Roles
						</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-kenic-blue">
							{roles.length}
						</div>
						<p className="text-xs text-muted-foreground">
							{activeRoles} active roles
						</p>
					</CardContent>
				</Card>
				<Card className="border-l-4 border-l-green-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Users
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{totalUsers}
						</div>
						<p className="text-xs text-muted-foreground">
							Across all roles
						</p>
					</CardContent>
				</Card>
				<Card className="border-l-4 border-l-yellow-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Resources
						</CardTitle>
						<Key className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{mockResources.length}
						</div>
						<p className="text-xs text-muted-foreground">
							Protected resources
						</p>
					</CardContent>
				</Card>
				<Card className="border-l-4 border-l-red-500">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Critical Roles
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{criticalRoles}
						</div>
						<p className="text-xs text-muted-foreground">
							High-risk access
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-4 h-12">
					<TabsTrigger
						value="overview"
						className="flex items-center gap-2 text-sm"
					>
						<Shield className="h-4 w-4" />
						Role Overview
					</TabsTrigger>
					<TabsTrigger
						value="permissions"
						className="flex items-center gap-2 text-sm"
					>
						<Key className="h-4 w-4" />
						Permission Matrix
					</TabsTrigger>
					<TabsTrigger
						value="resources"
						className="flex items-center gap-2 text-sm"
					>
						<Settings className="h-4 w-4" />
						Resources
					</TabsTrigger>
					<TabsTrigger
						value="assignments"
						className="flex items-center gap-2 text-sm"
					>
						<Users className="h-4 w-4" />
						User Assignments
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					{/* Search */}
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search roles..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 h-12"
						/>
					</div>

					{/* Role Cards */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredRoles.map((role) => (
							<Card
								key={role.id}
								className="hover:shadow-lg transition-all duration-200 border-2 hover:border-kenic-blue/30"
							>
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-3">
											{role.isSystemRole ? (
												<Crown className="h-6 w-6 text-yellow-500" />
											) : (
												<UserCheck className="h-6 w-6 text-kenic-blue" />
											)}
											<div>
												<CardTitle className="text-lg text-kenic-blue">
													{role.name}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													{role.slug}
												</p>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											<Badge
												className={getRiskLevelColor(
													role.riskLevel,
												)}
											>
												{getRiskIcon(role.riskLevel)}
												{role.riskLevel}
											</Badge>
											{role.isActive ? (
												<Badge
													variant="default"
													className="bg-green-100 text-green-800"
												>
													<CheckCircle2 className="h-3 w-3 mr-1" />
													Active
												</Badge>
											) : (
												<Badge variant="secondary">
													<XCircle className="h-3 w-3 mr-1" />
													Inactive
												</Badge>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm text-muted-foreground">
										{role.description}
									</p>

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												Users Assigned
											</span>
											<Badge
												variant="outline"
												className="font-bold"
											>
												{role.userCount}
											</Badge>
										</div>

										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												Permissions
											</span>
											<Badge
												variant="outline"
												className="font-bold"
											>
												{role.permissions.length}
											</Badge>
										</div>

										<div className="space-y-1">
											<div className="flex items-center justify-between text-sm">
												<span>Permission Coverage</span>
												<span>
													{Math.round(
														(role.permissions
															.length /
															64) *
															100,
													)}
													%
												</span>
											</div>
											<Progress
												value={
													(role.permissions.length /
														64) *
													100
												}
												className="h-2"
											/>
										</div>
									</div>

									<div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
										<span>Created: {role.createdAt}</span>
										<span>
											Modified: {role.lastModified}
										</span>
									</div>

									<div className="flex justify-end gap-2 pt-2">
										<Button
											variant="ghost"
											size="sm"
											className="text-kenic-blue hover:text-kenic-blue/80"
										>
											<Eye className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-kenic-blue hover:text-kenic-blue/80"
										>
											<Edit className="h-4 w-4" />
										</Button>
										{!role.isSystemRole && (
											<Button
												variant="ghost"
												size="sm"
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* Permission Matrix */}
				<TabsContent value="permissions" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-xl text-kenic-blue">
								Permission Matrix
							</CardTitle>
							<p className="text-muted-foreground">
								Visual overview of all permissions across
								resources
							</p>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<div className="min-w-[800px]">
									<div className="grid grid-cols-9 gap-2 mb-4">
										<div className="font-semibold text-sm">
											Resource
										</div>
										{mockActions.map((action) => (
											<div
												key={action.id}
												className="text-center"
											>
												<div className="text-lg mb-1">
													{action.icon}
												</div>
												<div className="text-xs font-medium">
													{action.displayName}
												</div>
											</div>
										))}
									</div>
									{mockResources.map((resource) => (
										<div
											key={resource.id}
											className="grid grid-cols-9 gap-2 py-3 border-b hover:bg-gray-50"
										>
											<div className="flex items-center gap-2">
												<span className="text-lg">
													{resource.icon}
												</span>
												<div>
													<div className="font-medium text-sm">
														{resource.displayName}
													</div>
													<div className="text-xs text-muted-foreground">
														{resource.category}
													</div>
												</div>
											</div>
											{mockActions.map((action) => (
												<div
													key={action.id}
													className="flex justify-center"
												>
													<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
														<CheckCircle2 className="h-4 w-4 text-green-600" />
													</div>
												</div>
											))}
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Resources */}
				<TabsContent value="resources" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						{mockResources.map((resource) => (
							<Card
								key={resource.id}
								className="border-2 hover:border-kenic-blue/30 transition-all duration-200"
							>
								<CardHeader className="pb-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-12 h-12 rounded-lg bg-kenic-blue/10 flex items-center justify-center">
												<span className="text-2xl">
													{resource.icon}
												</span>
											</div>
											<div>
												<CardTitle className="text-lg text-kenic-blue">
													{resource.displayName}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													/{resource.name}
												</p>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											<Badge
												variant="outline"
												className="capitalize"
											>
												{resource.category}
											</Badge>
											<Badge
												className={getRiskLevelColor(
													resource.riskLevel,
												)}
											>
												{getRiskIcon(
													resource.riskLevel,
												)}
												{resource.riskLevel}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm text-muted-foreground">
										{resource.description}
									</p>

									<div className="space-y-3">
										<div className="text-sm font-medium text-kenic-blue">
											Available Actions:
										</div>
										<div className="grid grid-cols-2 gap-2">
											{mockActions
												.slice(0, 6)
												.map((action) => (
													<div
														key={action.id}
														className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
													>
														<span className="text-sm">
															{action.icon}
														</span>
														<span className="text-xs font-medium">
															{action.displayName}
														</span>
													</div>
												))}
										</div>
									</div>

									<div className="flex items-center justify-between pt-3 border-t">
										<span className="text-sm text-muted-foreground">
											Roles with access:
										</span>
										<Badge
											variant="outline"
											className="font-bold"
										>
											{
												roles.filter((role) =>
													role.permissions.some(
														(p) =>
															Math.floor(
																p / 10,
															) === resource.id,
													),
												).length
											}
										</Badge>
									</div>

									<div className="flex justify-end gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="text-kenic-blue hover:text-kenic-blue/80"
										>
											<Settings className="h-4 w-4 mr-1" />
											Configure
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-kenic-blue hover:text-kenic-blue/80"
										>
											<Eye className="h-4 w-4 mr-1" />
											View Details
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				{/* User Assignments */}
				<TabsContent value="assignments" className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="relative max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search users..."
								className="pl-10 h-12"
							/>
						</div>
						<Button className="bg-kenic-blue hover:bg-kenic-blue/90">
							<Plus className="mr-2 h-4 w-4" />
							Assign Role
						</Button>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="text-xl text-kenic-blue">
								User Role Assignments
							</CardTitle>
							<p className="text-muted-foreground">
								Manage user role assignments and permissions
							</p>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{/* User Assignment Cards */}
								<div className="grid gap-4">
									<Card className="border-l-4 border-l-red-500">
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
														<Crown className="h-6 w-6 text-red-600" />
													</div>
													<div>
														<h3 className="font-semibold text-lg">
															John Doe
														</h3>
														<p className="text-sm text-muted-foreground">
															john@kenic.or.ke
														</p>
														<div className="flex items-center gap-2 mt-2">
															<Badge className="bg-red-500 text-white">
																<Crown className="h-3 w-3 mr-1" />
																Super
																Administrator
															</Badge>
															<Badge
																variant="outline"
																className="text-xs"
															>
																Critical Access
															</Badge>
														</div>
													</div>
												</div>
												<div className="flex flex-col items-end gap-2">
													<div className="text-sm text-muted-foreground">
														Assigned: 2024-01-15
													</div>
													<div className="text-sm text-muted-foreground">
														By: System
													</div>
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="sm"
															className="text-kenic-blue hover:text-kenic-blue/80"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="text-red-600 hover:text-red-700"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="border-l-4 border-l-yellow-500">
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
														<UserCheck className="h-6 w-6 text-yellow-600" />
													</div>
													<div>
														<h3 className="font-semibold text-lg">
															Sarah Wilson
														</h3>
														<p className="text-sm text-muted-foreground">
															sarah@kenic.or.ke
														</p>
														<div className="flex items-center gap-2 mt-2">
															<Badge className="bg-yellow-500 text-white">
																<UserCheck className="h-3 w-3 mr-1" />
																Content Manager
															</Badge>
															<Badge
																variant="outline"
																className="text-xs"
															>
																Medium Access
															</Badge>
														</div>
													</div>
												</div>
												<div className="flex flex-col items-end gap-2">
													<div className="text-sm text-muted-foreground">
														Assigned: 2024-02-20
													</div>
													<div className="text-sm text-muted-foreground">
														By: John Doe
													</div>
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="sm"
															className="text-kenic-blue hover:text-kenic-blue/80"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="text-red-600 hover:text-red-700"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="border-l-4 border-l-orange-500">
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
														<UserCheck className="h-6 w-6 text-orange-600" />
													</div>
													<div>
														<h3 className="font-semibold text-lg">
															Mike Johnson
														</h3>
														<p className="text-sm text-muted-foreground">
															mike@kenic.or.ke
														</p>
														<div className="flex items-center gap-2 mt-2">
															<Badge className="bg-orange-500 text-white">
																<UserCheck className="h-3 w-3 mr-1" />
																Registrar
																Coordinator
															</Badge>
															<Badge
																variant="outline"
																className="text-xs"
															>
																High Access
															</Badge>
														</div>
													</div>
												</div>
												<div className="flex flex-col items-end gap-2">
													<div className="text-sm text-muted-foreground">
														Assigned: 2024-03-10
													</div>
													<div className="text-sm text-muted-foreground">
														By: John Doe
													</div>
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="sm"
															className="text-kenic-blue hover:text-kenic-blue/80"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="text-red-600 hover:text-red-700"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="border-l-4 border-l-green-500">
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
														<UserCheck className="h-6 w-6 text-green-600" />
													</div>
													<div>
														<h3 className="font-semibold text-lg">
															Lisa Chen
														</h3>
														<p className="text-sm text-muted-foreground">
															lisa@kenic.or.ke
														</p>
														<div className="flex items-center gap-2 mt-2">
															<Badge className="bg-green-500 text-white">
																<UserCheck className="h-3 w-3 mr-1" />
																Analytics Viewer
															</Badge>
															<Badge
																variant="outline"
																className="text-xs"
															>
																Low Access
															</Badge>
														</div>
													</div>
												</div>
												<div className="flex flex-col items-end gap-2">
													<div className="text-sm text-muted-foreground">
														Assigned: 2024-04-20
													</div>
													<div className="text-sm text-muted-foreground">
														By: Sarah Wilson
													</div>
													<div className="flex gap-2">
														<Button
															variant="ghost"
															size="sm"
															className="text-kenic-blue hover:text-kenic-blue/80"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="text-red-600 hover:text-red-700"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Role Distribution Summary */}
								<Card className="mt-6">
									<CardHeader>
										<CardTitle className="text-lg text-kenic-blue">
											Role Distribution Summary
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											{roles
												.filter((r) => r.isActive)
												.map((role) => (
													<div
														key={role.id}
														className="text-center p-4 rounded-lg bg-gray-50"
													>
														<div className="text-2xl font-bold text-kenic-blue">
															{role.userCount}
														</div>
														<div className="text-sm font-medium">
															{role.name}
														</div>
														<div className="text-xs text-muted-foreground mt-1">
															{Math.round(
																(role.userCount /
																	totalUsers) *
																	100,
															)}
															% of users
														</div>
													</div>
												))}
										</div>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
