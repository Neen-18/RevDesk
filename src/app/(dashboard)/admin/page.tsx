import CountChartContainer from "@/components/CountChartContainer";
import ServiceLeaderboard from "@/components/ServiceLeaderboard";
import InvoiceStatusBreakdown from "@/components/InvoiceStatusBreakdown";
import OutstandingReceivables from "@/components/OutstandingReceivables";
import AverageInvoiceValue from "@/components/AverageInvoiceValue";
import CustomerRetention from "@/components/CustomerRetention";
import DashboardFilter from "@/components/DashboardFilter";
import TopCustomers from "@/components/TopCustomers";
import MiniCalendar from "@/components/MiniCalendar";
import { getInvoices } from "@/lib/firebase/firestore";
import { getDateRange, Period } from "@/lib/util";

const periodLabels: Record<Period, string> = {
	today: "Today",
	thisWeek: "This Week",
	currentMonth: "This Month",
	ytd: "YTD",
};

const AdminPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const params = await searchParams;
	const period = (params.period as Period) ?? "currentMonth";
	const { startDate, endDate } = getDateRange(period);
	const periodLabel = periodLabels[period];

	const allInvoices = await getInvoices();

	const periodStart = startDate.slice(0, 10);
	const periodEnd = endDate.slice(0, 10);
	const periodInvoices = allInvoices.filter(
		(inv) => inv.createdAt >= periodStart && inv.createdAt <= periodEnd,
	);

	// OutstandingReceivables all-time unpaid
	const pendingTotal = allInvoices
		.filter((inv) => inv.status === "Pending")
		.reduce((sum, inv) => sum + inv.amount, 0);
	const overdueTotal = allInvoices
		.filter((inv) => inv.status === "Overdue")
		.reduce((sum, inv) => sum + inv.amount, 0);

	// AverageInvoiceValue by period, paid only
	const paidInvoices = periodInvoices.filter((inv) => inv.status === "Paid");
	const paidCount = paidInvoices.length;
	const averageValue =
		paidCount > 0
			? paidInvoices.reduce((sum, inv) => sum + inv.amount, 0) / paidCount
			: 0;
	const highestAmount =
		paidCount > 0 ? Math.max(...paidInvoices.map((inv) => inv.amount)) : 0;
	const lowestAmount =
		paidCount > 0 ? Math.min(...paidInvoices.map((inv) => inv.amount)) : 0;

	// ServiceLeaderboard by period, aggregate by service type
	const serviceRevenueMap = new Map<
		string,
		{ jobs: number; revenue: number }
	>();
	for (const inv of periodInvoices) {
		for (const service of inv.services) {
			const key = service.serviceType || "Unknown";
			const existing = serviceRevenueMap.get(key) ?? { jobs: 0, revenue: 0 };
			serviceRevenueMap.set(key, {
				jobs: existing.jobs + service.quantity,
				revenue: existing.revenue + service.quantity * service.price,
			});
		}
	}
	const serviceStats = Array.from(serviceRevenueMap.entries()).map(
		([serviceType, totals]) => ({ serviceType, ...totals }),
	);

	// InvoiceStatusBreakdown by period, grouped by status
	const invoiceStatusGroups = (
		["Paid", "Pending", "Overdue", "Draft"] as const
	).map((status) => ({
		status,
		count: periodInvoices.filter((inv) => inv.status === status).length,
		revenue: periodInvoices
			.filter((inv) => inv.status === status)
			.reduce((sum, inv) => sum + inv.amount, 0),
	}));

	// CountChartContainer by period
	const grossRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
	const paidInvoiceCount = paidInvoices.length;
	const totalInvoiceCount = periodInvoices.length;

	// TopCustomers by period, grouped by customer
	const customerRevenueMap = new Map<
		string,
		{ name: string; jobs: number; revenue: number }
	>();
	for (const inv of periodInvoices) {
		const existing = customerRevenueMap.get(inv.customerId) ?? {
			name: inv.customerName,
			jobs: 0,
			revenue: 0,
		};
		customerRevenueMap.set(inv.customerId, {
			name: inv.customerName,
			jobs: existing.jobs + 1,
			revenue: existing.revenue + inv.amount,
		});
	}
	const topCustomers = Array.from(customerRevenueMap.values())
		.sort((a, b) => b.revenue - a.revenue)
		.slice(0, 5);

	// CustomerRetention by period
	// returning = had an invoice before this period; new = first invoice is in this period
	const periodCustomerIds = new Set(
		periodInvoices.map((inv) => inv.customerId),
	);
	let returningCount = 0;
	let newCount = 0;
	for (const customerId of periodCustomerIds) {
		const isReturning = allInvoices.some(
			(inv) => inv.customerId === customerId && inv.createdAt < periodStart,
		);
		if (isReturning) returningCount++;
		else newCount++;
	}

	return (
		<div className="p-4 flex gap-4 flex-col md:flex-row">
			{/* LEFT */}
			<div className="w-full lg:w-2/3 flex flex-col gap-6">
				{/* HEADER WITH FILTER */}
				<div className="flex items-center justify-between flex-wrap gap-3">
					<h1 className="text-xl font-bold text-revDeskPurple-dark">
						Dashboard - {periodLabel}
					</h1>
					<DashboardFilter active={period} searchParams={params} />
				</div>

				{/* QUICK STATS ROW */}
				<div className="flex gap-4 flex-col lg:flex-row">
					<OutstandingReceivables
						pending={pendingTotal}
						overdue={overdueTotal}
					/>
					<AverageInvoiceValue
						avg={averageValue}
						highest={highestAmount}
						lowest={lowestAmount}
						count={paidCount}
					/>
				</div>

				{/* LEADERBOARD & STATUS */}
				<div className="flex gap-4 flex-col lg:flex-row">
					<div className="w-full lg:w-1/2">
						<ServiceLeaderboard
							services={serviceStats}
							sortBy={(params.serviceSort as "revenue" | "jobs") ?? "revenue"}
							searchParams={params}
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<InvoiceStatusBreakdown groups={invoiceStatusGroups} />
					</div>
				</div>

				{/* REVENUE SUMMARY */}
				<CountChartContainer
					grossRevenue={grossRevenue}
					paidInvoiceCount={paidInvoiceCount}
					totalInvoiceCount={totalInvoiceCount}
				/>
			</div>

			{/* RIGHT */}
			<div className="w-full lg:w-1/3 flex flex-col gap-6 self-stretch">
				<TopCustomers customers={topCustomers} />
				<CustomerRetention
					returningCount={returningCount}
					newCount={newCount}
				/>
				<MiniCalendar />
			</div>
		</div>
	);
};

export default AdminPage;
