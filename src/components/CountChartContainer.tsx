const fmt = (n: number) =>
	n.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

const CountChartContainer = ({
	grossRevenue,
	paidInvoiceCount,
	totalInvoiceCount,
}: {
	grossRevenue: number;
	paidInvoiceCount: number;
	totalInvoiceCount: number;
}) => {
	const gst = grossRevenue * 0.05;

	return (
		<div className="bg-revDeskPink-dark rounded-xl w-full p-5 flex flex-col gap-4 border-b-3 border-revDeskPink">
			<div>
				<h1 className="text-lg font-bold text-revDeskPurple-dark">Revenue Summary</h1>
				<p className="text-xs text-gray-500 mt-0.5">Based on paid invoices</p>
			</div>

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

			<div className="border-t border-revDeskPink-light" />

			<div className="grid grid-cols-3 gap-2">
				<div className="bg-revDeskPink rounded-lg px-3 py-2">
					<p className="text-[11px] text-gray-500 mb-0.5">GST Collected</p>
					<p className="text-sm font-bold text-revDeskBlue">${fmt(gst)}</p>
				</div>
				<div className="bg-revDeskPink rounded-lg px-3 py-2">
					<p className="text-[11px] text-gray-500 mb-0.5">Paid Invoices</p>
					<p className="text-sm font-bold text-white">{paidInvoiceCount}</p>
				</div>
				<div className="bg-revDeskPink rounded-lg px-3 py-2">
					<p className="text-[11px] text-gray-500 mb-0.5">Total Invoices</p>
					<p className="text-sm font-bold text-white">{totalInvoiceCount}</p>
				</div>
			</div>
		</div>
	);
};

export default CountChartContainer;
