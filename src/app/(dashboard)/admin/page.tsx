import CountChartContainer from "@/components/CountChartContainer";
import ServiceLeaderboard from "@/components/ServiceLeaderboard";
import InvoiceStatusBreakdown from "@/components/InvoiceStatusBreakdown";
import OutstandingReceivables from "@/components/OutstandingReceivables";
import AverageInvoiceValue from "@/components/AverageInvoiceValue";
import CustomerRetention from "@/components/CustomerRetention";
import DashboardFilter from "@/components/DashboardFilter";
import TopCustomers from "@/components/TopCustomers";
import MiniCalendar from "@/components/MiniCalendar";

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

	return (
		<div className="p-4 flex gap-4 flex-col md:flex-row">
			{/* LEFT */}
			<div className="w-full lg:w-2/3 flex flex-col gap-6">
				{/* HEADER WITH FILTER */}
				<div className="flex items-center justify-between flex-wrap gap-3">
					<h1 className="text-xl font-bold text-white">Dashboard</h1>
					<DashboardFilter active={period} searchParams={params} />
				</div>

				{/* QUICK STATS ROW */}
				<div className="flex gap-4 flex-col lg:flex-row">
					<OutstandingReceivables />
					<AverageInvoiceValue startDate={startDate} endDate={endDate} />
				</div>

				{/* LEADERBOARD + STATUS */}
				<div className="flex gap-4 flex-col lg:flex-row">
					<div className="w-full lg:w-1/2">
						<ServiceLeaderboard
							startDate={startDate}
							endDate={endDate}
							sortBy={(params.serviceSort as "revenue" | "jobs") ?? "revenue"}
							searchParams={params}
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<InvoiceStatusBreakdown startDate={startDate} endDate={endDate} />
					</div>
				</div>

				{/* REVENUE SUMMARY */}
				<CountChartContainer startDate={startDate} endDate={endDate} />
			</div>

			{/* RIGHT */}
			<div className="w-full lg:w-1/3 flex flex-col gap-6 self-stretch">
				<TopCustomers startDate={startDate} endDate={endDate} />
				<CustomerRetention startDate={startDate} endDate={endDate} />
				<MiniCalendar />
			</div>
		</div>
	);
};

export default AdminPage;
