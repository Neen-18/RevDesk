const RANK_BADGES = [
	{ badge: "bg-yellow-400 text-black", glow: "shadow-yellow-400/30" },
	{ badge: "bg-gray-300 text-black", glow: "shadow-gray-300/20" },
	{ badge: "bg-orange-400 text-black", glow: "shadow-orange-400/30" },
];

const getTypeColor = (type: string) =>
	({
		Retailer: "text-revDeskBlue",
		Insurance: "text-revDeskGreen",
		Fleet: "text-revDeskOrange",
		Vendor: "text-purple-400",
	})[type] ?? "text-gray-400";

const MOCK_CUSTOMERS = [
	{ name: "Carlos Mendoza", type: "Fleet", jobs: 14, revenue: 8420 },
	{ name: "Sarah Johnson", type: "Insurance", jobs: 9, revenue: 5310 },
	{ name: "Mike's Auto Parts", type: "Retailer", jobs: 11, revenue: 4780 },
	{ name: "David Park", type: "Vendor", jobs: 6, revenue: 3150 },
	{ name: "Lisa Torres", type: "Insurance", jobs: 5, revenue: 2240 },
];

const TopCustomers = (_: { startDate: string; endDate: string }) => {
	const customers = MOCK_CUSTOMERS;
	const maxRevenue = customers[0]?.revenue ?? 1;

	return (
		<div className="bg-revDeskBlack-dark rounded-xl p-5">
			<div className="flex justify-between items-center mb-5">
				<div>
					<h1 className="text-lg font-bold text-white">Top Customers</h1>
					<p className="text-xs text-gray-500 mt-0.5">By total spend</p>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				{customers.map((customer, rank) => {
					const badge = RANK_BADGES[rank] ?? {
						badge: "bg-revDeskBlack-light text-gray-400",
						glow: "",
					};
					const revenueShare = Math.round(
						(customer.revenue / maxRevenue) * 100,
					);

					return (
						<div key={customer.name} className="flex items-center gap-3">
							<span
								className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md ${badge.badge} ${badge.glow}`}>
								{rank + 1}
							</span>

							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-center">
									<span className="text-sm font-semibold text-white truncate pr-2">
										{customer.name}
									</span>
									<span className="text-sm font-bold text-revDeskGreen shrink-0">
										${customer.revenue.toLocaleString()}
									</span>
								</div>

								<div className="flex items-center gap-2 mt-0.5 mb-1.5">
									<span className="text-[11px] text-gray-500">
										{customer.jobs} invoice{customer.jobs !== 1 ? "s" : ""}
									</span>
									<span className="text-[11px] text-gray-600">·</span>
									<span
										className={`text-[11px] font-medium ${getTypeColor(customer.type)}`}>
										{customer.type}
									</span>
								</div>

								<div className="w-full bg-revDeskBlack rounded-full h-1 overflow-hidden">
									<div
										className="h-1 rounded-full bg-linear-to-r from-revDeskBlue to-revDeskGreen"
										style={{ width: `${revenueShare}%` }}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TopCustomers;
