const fmt = (n: number) =>
	n.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

const MOCK_SUMMARY = {
	grossRevenue: 22400,
	totalExpenses: 8150,
	paidInvoiceCount: 48,
	totalInvoiceCount: 78,
};

const CountChartContainer = (_: { startDate: string; endDate: string }) => {
	const { grossRevenue, totalExpenses, paidInvoiceCount, totalInvoiceCount } =
		MOCK_SUMMARY;
	const gst = grossRevenue * 0.05;
	const netProfit = grossRevenue - totalExpenses;
	const margin =
		grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;
	const expensePct =
		grossRevenue > 0
			? Math.min(100, Math.round((totalExpenses / grossRevenue) * 100))
			: 0;

	return (
		<div className="bg-revDeskBlack-dark rounded-xl w-full p-5 flex flex-col gap-4">
			<div>
				<h1 className="text-lg font-bold text-white">Revenue Summary</h1>
				<p className="text-xs text-gray-500 mt-0.5">Based on paid invoices</p>
			</div>

			{/* GROSS REVENUE */}
			<div>
				<div className="flex justify-between items-center mb-1.5">
					<span className="text-xs text-gray-400 uppercase tracking-wide">
						Gross Revenue
					</span>
					<span className="text-sm font-bold text-revDeskGreen">
						${fmt(grossRevenue)}
					</span>
				</div>
				<div className="w-full bg-revDeskBlack rounded-full h-2">
					<div className="h-2 rounded-full bg-revDeskGreen w-full" />
				</div>
			</div>

			{/* EXPENSES */}
			<div>
				<div className="flex justify-between items-center mb-1.5">
					<span className="text-xs text-gray-400 uppercase tracking-wide">
						Expenses
					</span>
					<span className="text-sm font-bold text-revDeskOrange">
						${fmt(totalExpenses)}
					</span>
				</div>
				<div className="w-full bg-revDeskBlack rounded-full h-2">
					<div
						className="h-2 rounded-full bg-revDeskOrange"
						style={{ width: `${expensePct}%` }}
					/>
				</div>
			</div>

			<div className="border-t border-revDeskBlack-light" />

			{/* NET PROFIT */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
						Net Profit
					</p>
					<p
						className={`text-2xl font-bold ${netProfit >= 0 ? "text-white" : "text-red-400"}`}>
						{netProfit < 0 ? "-" : ""}${fmt(Math.abs(netProfit))}
					</p>
				</div>
				<div
					className={`px-3 py-1.5 rounded-full text-sm font-bold ${
						margin >= 0
							? "bg-revDeskGreen/20 text-revDeskGreen"
							: "bg-red-500/20 text-red-400"
					}`}>
					{margin}% margin
				</div>
			</div>

			{/* BOTTOM STATS */}
			<div className="grid grid-cols-3 gap-2 mt-auto">
				<div className="bg-revDeskBlack-light rounded-lg px-3 py-2">
					<p className="text-[11px] text-gray-500 mb-0.5">GST Collected</p>
					<p className="text-sm font-bold text-revDeskBlue">${fmt(gst)}</p>
				</div>
				<div className="bg-revDeskBlack-light rounded-lg px-3 py-2">
					<p className="text-[11px] text-gray-500 mb-0.5">Paid Invoices</p>
					<p className="text-sm font-bold text-white">{paidInvoiceCount}</p>
				</div>
				<div className="bg-revDeskBlack-light rounded-lg px-3 py-2">
					<p className="text-[11px] text-gray-500 mb-0.5">Total Invoices</p>
					<p className="text-sm font-bold text-white">{totalInvoiceCount}</p>
				</div>
			</div>
		</div>
	);
};

export default CountChartContainer;
