import { OrderStats, PaymentStats } from '@/components/orders/OrderStats';
import { OrderTableSchema } from '@/components/orders/OrderTableSchema';
import { PaymentTableSchema } from '@/components/orders/PaymentTableSchema';
import { DataTable } from '@/components/table/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Orders
const orders = [
	{
		id: 1,
		user_id: 12,
		amount: 120.5,
		status: 'pending',
		payment_status: false,
		order_details: {
			first_name: 'Alice',
			last_name: 'Johnson',
			email: 'alice.johnson@example.com',
			phone_number: '5551234567',
			address: '123 Main St',
			city: 'New York',
			postal_code: '10001',
			payment_method: 'Credit Card',
		},
	},
	{
		id: 2,
		user_id: 5,
		amount: 75,
		status: 'completed',
		payment_status: true,
		order_details: {
			first_name: 'Bob',
			last_name: 'Smith',
			email: 'bob.smith@example.com',
			phone_number: '5552345678',
			address: '456 Park Ave',
			city: 'Chicago',
			postal_code: '60601',
			payment_method: 'mpesa',
		},
	},
	{
		id: 3,
		user_id: null,
		amount: 210,
		status: 'shipped',
		payment_status: true,
		order_details: {
			first_name: 'Charlie',
			last_name: 'Brown',
			email: 'charlie.brown@example.com',
			phone_number: '5553456789',
			address: '789 Elm St',
			city: 'Los Angeles',
			postal_code: '90001',
			payment_method: 'Debit Card',
		},
	},
	{
		id: 4,
		user_id: 8,
		amount: 55,
		status: 'cancelled',
		payment_status: false,
		order_details: {
			first_name: 'Diana',
			last_name: 'Prince',
			email: 'diana.prince@example.com',
			phone_number: '5554567890',
			address: '1010 Maple Rd',
			city: 'Seattle',
			postal_code: '98101',
			payment_method: 'Cash on Delivery',
		},
	},
	{
		id: 5,
		user_id: 20,
		amount: 330,
		status: 'processing',
		payment_status: false,
		order_details: {
			first_name: 'Ethan',
			last_name: 'Hunt',
			email: 'ethan.hunt@example.com',
			phone_number: '5555678901',
			address: '2020 Oak St',
			city: 'Miami',
			postal_code: '33101',
			payment_method: 'Credit Card',
		},
	},
	{
		id: 6,
		user_id: 14,
		amount: 95.5,
		status: 'delivered',
		payment_status: true,
		order_details: {
			first_name: 'Fiona',
			last_name: 'Williams',
			email: 'fiona.williams@example.com',
			phone_number: '5556789012',
			address: '3030 Pine Ln',
			city: 'Boston',
			postal_code: '02108',
			payment_method: 'Apple Pay',
		},
	},
];

const payments = [
	{
		id: 1,
		order_id: 101,
		user_id: 12,
		payment_method: 'card',
		amount: 1500.5,
		status: true,
		updated_by: 5,
		created_by: 3,
		updated_at: '2025-08-25T14:32:00.000Z',
		created_at: '2025-08-25T14:00:00.000Z',
	},
	{
		id: 2,
		order_id: 102,
		user_id: 14,
		payment_method: 'mpesa',
		amount: 300.0,
		status: true,
		updated_by: null,
		created_by: 2,
		updated_at: '2025-08-26T10:45:00.000Z',
		created_at: '2025-08-26T10:30:00.000Z',
	},
	{
		id: 3,
		order_id: 103,
		user_id: null,
		payment_method: 'bank',
		amount: 7800.75,
		status: false,
		updated_by: null,
		created_by: 1,
		updated_at: '2025-08-27T09:15:00.000Z',
		created_at: '2025-08-27T09:00:00.000Z',
	},
	{
		id: 4,
		order_id: 104,
		user_id: 18,
		payment_method: 'mpesa',
		amount: 1200.0,
		status: true,
		updated_by: 6,
		created_by: 4,
		updated_at: '2025-08-28T16:20:00.000Z',
		created_at: '2025-08-28T16:00:00.000Z',
	},
	{
		id: 5,
		order_id: 105,
		user_id: 20,
		payment_method: 'card',
		amount: 99999.99,
		status: false,
		updated_by: 7,
		created_by: 5,
		updated_at: '2025-08-29T11:45:00.000Z',
		created_at: '2025-08-29T11:30:00.000Z',
	},
	{
		id: 6,
		order_id: 106,
		user_id: 25,
		payment_method: 'mpesa',
		amount: 450.25,
		status: true,
		updated_by: null,
		created_by: 8,
		updated_at: '2025-08-29T18:00:00.000Z',
		created_at: '2025-08-29T17:50:00.000Z',
	},
	{
		id: 7,
		order_id: 107,
		user_id: null,
		payment_method: 'bank',
		amount: 2000.0,
		status: false,
		updated_by: 9,
		created_by: 6,
		updated_at: '2025-08-30T12:10:00.000Z',
		created_at: '2025-08-30T12:00:00.000Z',
	},
];

// Order Items
const order_items = [
	{
		order_id: 1,
		product_id: 3,
		size: 'M',
		color: 'red',
		quantity: 2,
		amount: 40.5,
	},
	{
		order_id: 1,
		product_id: 7,
		size: 'L',
		color: 'black',
		quantity: 1,
		amount: 80,
	},
	{
		order_id: 2,
		product_id: 4,
		size: 'S',
		color: 'blue',
		quantity: 3,
		amount: 75,
	},
	{
		order_id: 3,
		product_id: 2,
		size: 'XL',
		color: 'green',
		quantity: 2,
		amount: 120,
	},
	{
		order_id: 3,
		product_id: 6,
		size: 'M',
		color: 'white',
		quantity: 3,
		amount: 90,
	},
	{
		order_id: 4,
		product_id: 9,
		size: 'L',
		color: 'yellow',
		quantity: 1,
		amount: 55,
	},
	{
		order_id: 5,
		product_id: 1,
		size: 'M',
		color: 'black',
		quantity: 2,
		amount: 180,
	},
	{
		order_id: 5,
		product_id: 10,
		size: 'S',
		color: 'red',
		quantity: 3,
		amount: 150,
	},
	{
		order_id: 6,
		product_id: 8,
		size: 'XL',
		color: 'gray',
		quantity: 1,
		amount: 50,
	},
	{
		order_id: 6,
		product_id: 12,
		size: 'M',
		color: 'blue',
		quantity: 1,
		amount: 45.5,
	},
];

const orderPaid = [
	{
		value: 'paid',
		label: 'Paid',
	},
	{
		value: 'unpaid',
		label: 'Unpaid',
	},
];

const paymentMethods = [
	{
		value: 'mpesa',
		label: 'M-Pesa',
	},
	{
		value: 'card',
		label: 'Card',
	},
	{
		value: 'bank',
		label: 'Bank Transfer',
	},
];

const paymentStatus = [
	{
		value: 'completed',
		label: 'Completed',
	},
	{
		value: 'failed',
		label: 'Failed',
	},
];

const orderStatus = [
	{
		value: 'pending',
		label: 'Pending',
	},
	{
		value: 'processing',
		label: 'Processing',
	},
	{
		value: 'delivering',
		label: 'Delivering',
	},
	{
		value: 'delivered',
		label: 'Delivered',
	},
	{
		value: 'cancelled',
		label: 'Cancelled',
	},
];

function Orders() {
	const navigate = useNavigate();
	return (
		<div className="space-y-6 p-4 min-h-full bg-gray-100">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Orders & Payments
					</h1>
					<p className="text-muted-foreground">
						Manage your orders and payments
					</p>
				</div>
			</div>

			<Tabs className="space-y-6" defaultValue="orders">
				<TabsList>
					<TabsTrigger value="orders">Orders</TabsTrigger>
					<TabsTrigger value="payments">Payments</TabsTrigger>
				</TabsList>
				<TabsContent value="orders">
					<OrderStats orders={orders} />
					<DataTable
						data={orders}
						columns={OrderTableSchema(navigate)}
						facetedFilterColumns={[
							{
								id: 'payment',
								title: 'Payment Status',
								options: orderPaid,
							},
							{
								id: 'status',
								title: 'Status',
								options: orderStatus,
							},
						]}
					/>
				</TabsContent>
				<TabsContent value="payments">
					<PaymentStats payments={payments} />

					<DataTable
						data={payments}
						columns={PaymentTableSchema(navigate)}
						facetedFilterColumns={[
							{
								id: 'payment_method',
								title: 'Payment Method',
								options: paymentMethods,
							},
							{
								id: 'status',
								title: 'Status',
								options: paymentStatus,
							},
						]}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default Orders;
