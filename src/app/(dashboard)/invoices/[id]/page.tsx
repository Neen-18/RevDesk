import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/firebase/firestore";
import { formatDate, formatPhone } from "@/lib/util";
import EditInvoiceButton from "@/components/actions/invoice/EditInvoiceButton";
import { Invoice, InvoiceStatus } from "@/lib/types";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
	Paid: "bg-revDeskGreen/20 text-revDeskGreen",
	Pending: "bg-revDeskYellow/20 text-revDeskYellow",
	Overdue: "bg-revDeskRed/20 text-revDeskRed",
	Draft: "bg-gray-500/20 text-gray-400",
};

const InvoiceDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const invoice = await getInvoice(id);

	if (!invoice) notFound();

	const plainInvoice: Invoice = JSON.parse(JSON.stringify(invoice));

	return (
		<div className="p-6 flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-white">
						Invoice {invoice.invoiceNumber ?? invoice.id}
					</h1>
					<p className="text-sm text-gray-400 mt-1">
						{formatDate(invoice.createdAt)}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[invoice.status]}`}>
						{invoice.status}
					</span>
					<EditInvoiceButton invoice={plainInvoice} />
				</div>
			</div>

			{/* Customer Info */}
			<div className="bg-revDeskBlack-dark rounded-xl p-6 grid grid-cols-2 gap-4">
				<p className="col-span-2 text-xs font-semibold text-revDeskBlue uppercase tracking-widest mb-1">
					Customer
				</p>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Name
					</p>
					<p className="text-sm text-white">{invoice.customerName}</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Phone
					</p>
					<p className="text-sm text-white">
						{invoice.phone ? formatPhone(invoice.phone) : "—"}
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Email
					</p>
					<p className="text-sm text-white">{invoice.email || "—"}</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Address
					</p>
					<p className="text-sm text-white">{invoice.address || "—"}</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Payment Type
					</p>
					<p className="text-sm text-white">{invoice.paymentType || "—"}</p>
				</div>
			</div>

			{/* Services */}
			<div className="bg-revDeskBlack-dark rounded-xl p-6">
				<p className="text-xs font-semibold text-revDeskBlue uppercase tracking-widest mb-4">
					Services
				</p>
				<table className="w-full text-sm">
					<thead>
						<tr className="text-left text-xs text-gray-500 uppercase border-b border-revDeskBlack-light">
							<th className="pb-3 font-medium">Service</th>
							<th className="pb-3 font-medium">Vehicle</th>
							<th className="pb-3 font-medium text-center">Qty</th>
							<th className="pb-3 font-medium text-right">Price</th>
							<th className="pb-3 font-medium text-right">Total</th>
						</tr>
					</thead>
					<tbody>
						{invoice.services.map((s, i) => (
							<tr
								key={i}
								className="border-b border-revDeskBlack-light last:border-0">
								<td className="py-3">
									<p className="text-white">{s.serviceType || "—"}</p>
									{s.notes && (
										<p className="text-xs text-gray-500 mt-0.5">{s.notes}</p>
									)}
								</td>
								<td className="py-3 text-gray-400">{s.vehicleType}</td>
								<td className="py-3 text-gray-400 text-center">{s.quantity}</td>
								<td className="py-3 text-gray-400 text-right">
									${s.price.toFixed(2)}
								</td>
								<td className="py-3 text-white font-medium text-right">
									${(s.quantity * s.price).toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="mt-4 pt-4 border-t border-revDeskBlack-light flex justify-end">
					<div className="text-right">
						<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
							Total
						</p>
						<p className="text-2xl font-bold text-revDeskGreen">
							${invoice.amount.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvoiceDetailPage;
