import { notFound } from "next/navigation";
import { getCustomer, getCustomerInvoices } from "@/lib/firebase/firestore";
import EditCustomerButton from "@/components/actions/customer/EditCustomerButton";
import {
	formatDate,
	formatPhone,
	formatPostalCode,
	formatAddress,
} from "@/lib/util";
import { InvoiceStatus } from "@/lib/types";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
	Paid: "bg-revDeskGreen/20 text-revDeskGreen",
	Pending: "bg-revDeskYellow/20 text-revDeskYellow",
	Overdue: "bg-revDeskRed/20 text-revDeskRed",
	Draft: "bg-gray-500/20 text-gray-400",
};

const CustomerDetailPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const [customer, invoices] = await Promise.all([
		getCustomer(id),
		getCustomerInvoices(id),
	]);

	if (!customer) notFound();

	return (
		<div className="p-6 flex flex-col gap-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-white">
						{customer.firstName} {customer.lastName}
					</h1>
					<p className="text-sm text-gray-400 mt-1">{customer.email}</p>
				</div>
				<EditCustomerButton customer={customer} />
			</div>

			<div className="bg-revDeskBlack-dark rounded-xl p-6 grid grid-cols-2 gap-4">
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Phone
					</p>
					<p className="text-sm text-white">{formatPhone(customer.phone)}</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Last Visit
					</p>
					<p className="text-sm text-white">{formatDate(customer.lastVisit)}</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Total Visits
					</p>
					<p className="text-sm text-white">{customer.returnCounter}</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Postal Code
					</p>
					<p className="text-sm text-white">
						{customer.postalCode ? formatPostalCode(customer.postalCode) : "-"}
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
						Address
					</p>
					<p className="text-sm text-white">
						{formatAddress(customer.streetAddress1, customer.streetAddress2) ||
							"-"}
					</p>
				</div>
				{customer.notes && (
					<div className="col-span-2">
						<p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
							Notes
						</p>
						<p className="text-sm text-gray-300">{customer.notes}</p>
					</div>
				)}
			</div>

			<div className="bg-revDeskBlack-dark rounded-xl p-6">
				<h2 className="text-base font-semibold text-white mb-4">Invoices</h2>
				{invoices.length === 0 ? (
					<p className="text-sm text-gray-500">No invoices found.</p>
				) : (
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-xs text-gray-500 uppercase border-b border-revDeskBlack-light">
								<th className="pb-3 font-medium">Invoice</th>
								<th className="pb-3 font-medium">Date</th>
								<th className="pb-3 font-medium">Status</th>
								<th className="pb-3 font-medium text-right">Amount</th>
							</tr>
						</thead>
						<tbody>
							{invoices.map((inv) => (
								<tr
									key={inv.id}
									className="border-b border-revDeskBlack-light last:border-0">
									<td className="py-3 text-white font-medium">
										{inv.invoiceNumber ?? inv.id}
									</td>
									<td className="py-3 text-gray-400">
										{formatDate(inv.createdAt)}
									</td>
									<td className="py-3">
										<span
											className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[inv.status]}`}>
											{inv.status}
										</span>
									</td>
									<td className="py-3 text-white text-right">
										${inv.amount.toFixed(2)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default CustomerDetailPage;
