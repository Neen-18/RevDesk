const fmt = (n: number) =>
	n.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

const MOCK_INVOICE_DATA = {
	avg: 347.5,
	highest: 1280.0,
	lowest: 45.0,
	count: 62,
};

const AverageInvoiceValue = (_: { startDate: string; endDate: string }) => {
	const { avg, highest, lowest, count } = MOCK_INVOICE_DATA;

	return (
		<div className="bg-revDeskBlack-dark rounded-xl p-5 flex flex-col gap-3 flex-1">
			<div>
				<h2 className="text-sm font-bold text-white">Avg Invoice Value</h2>
				<p className="text-[11px] text-gray-500 mt-0.5">Paid invoices only</p>
			</div>

			<p className="text-2xl font-bold text-revDeskBlue">${fmt(avg)}</p>

			<div className="flex flex-col gap-1.5 mt-auto">
				<div className="flex justify-between text-xs">
					<span className="text-gray-500">Highest</span>
					<span className="text-revDeskGreen font-semibold">
						${fmt(highest)}
					</span>
				</div>
				<div className="flex justify-between text-xs">
					<span className="text-gray-500">Lowest</span>
					<span className="text-gray-300 font-semibold">${fmt(lowest)}</span>
				</div>
				<div className="flex justify-between text-xs">
					<span className="text-gray-500">Sample size</span>
					<span className="text-gray-300 font-semibold">{count} invoices</span>
				</div>
			</div>
		</div>
	);
};

export default AverageInvoiceValue;
