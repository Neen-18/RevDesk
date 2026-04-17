"use client";

import { useState } from "react";
import { updateInvoice } from "@/lib/firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Field from "@/components/Field";
import { Invoice, InvoiceStatus, ServiceLine } from "@/lib/types";

type InvoiceProps = {
	invoice: Invoice;
	onClose: () => void;
	onUpdated: () => void;
};

const STATUSES: InvoiceStatus[] = ["Draft", "Pending", "Paid", "Overdue"];
const PAYMENT_TYPES = [
	"-- Select --",
	"Cash",
	"Credit Card",
	"Debit Card",
	"E-Transfer",
	"Cheque",
];
const VEHICLE_TYPES = ["Sedan", "SUV", "Truck", "Van", "Motorcycle", "Other"];

const EditInvoiceModal = ({ invoice, onClose, onUpdated }: InvoiceProps) => {
	const [status, setStatus] = useState<InvoiceStatus>(invoice.status);
	const [paymentType, setPaymentType] = useState(
		invoice.paymentType || "-- Select --",
	);
	const [services, setServices] = useState<ServiceLine[]>(invoice.services);
	const [loading, setLoading] = useState(false);

	const handleServiceChange = (
		index: number,
		field: keyof ServiceLine,
		value: string | number,
	) => {
		setServices((prev) =>
			prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
		);
	};

	const addService = () =>
		setServices((prev) => [
			...prev,
			{ vehicleType: "SUV", serviceType: "", quantity: 1, price: 0, notes: "" },
		]);
	const removeService = (index: number) =>
		setServices((prev) => prev.filter((_, i) => i !== index));

	const total = services.reduce((sum, s) => sum + s.quantity * s.price, 0);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			await updateInvoice(invoice.id, {
				status,
				paymentType,
				services,
				amount: total,
			});
			onUpdated();
			onClose();
		} catch (err) {
			console.error("Failed to update invoice:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-revDeskBlack w-full max-w-3xl rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white">
					<FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
				</button>

				<h2 className="text-xl font-bold text-white mb-1">Edit Invoice</h2>
				<p className="text-sm text-gray-400 mb-6">
					{invoice.invoiceNumber ?? invoice.id} — {invoice.customerName}
				</p>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-xs text-gray-400 mb-1">
								Invoice Status
							</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
								className="w-full bg-revDeskBlack-dark text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue">
								{STATUSES.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-xs text-gray-400 mb-1">
								Payment Type
							</label>
							<select
								value={paymentType}
								onChange={(e) => setPaymentType(e.target.value)}
								className="w-full bg-revDeskBlack-dark text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue">
								{PAYMENT_TYPES.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</select>
						</div>
					</div>

					<div>
						<div className="flex items-center gap-3 mb-3">
							<span className="text-xs font-semibold text-revDeskBlue uppercase tracking-widest whitespace-nowrap">
								Services
							</span>
							<div className="flex-1 h-px bg-white/10" />
						</div>

						{services.map((service, i) => (
							<div
								key={i}
								className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-revDeskBlack-dark relative mb-3">
								{services.length > 1 && (
									<button
										type="button"
										onClick={() => removeService(i)}
										className="absolute top-3 right-3 text-gray-500 hover:text-red-400">
										<FontAwesomeIcon icon={faTrashCan} className="w-3.5" />
									</button>
								)}
								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs text-gray-400 mb-1">
											Vehicle Type
										</label>
										<select
											value={service.vehicleType}
											onChange={(e) =>
												handleServiceChange(i, "vehicleType", e.target.value)
											}
											className="w-full bg-revDeskBlack text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue">
											{VEHICLE_TYPES.map((v) => (
												<option key={v} value={v}>
													{v}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-xs text-gray-400 mb-1">
											Service Type
										</label>
										<input
											type="text"
											value={service.serviceType}
											onChange={(e) =>
												handleServiceChange(i, "serviceType", e.target.value)
											}
											className="w-full bg-revDeskBlack text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue"
										/>
									</div>
									<div>
										<label className="block text-xs text-gray-400 mb-1">
											Quantity
										</label>
										<input
											type="number"
											min={1}
											value={service.quantity}
											onChange={(e) =>
												handleServiceChange(
													i,
													"quantity",
													parseInt(e.target.value) || 1,
												)
											}
											className="w-full bg-revDeskBlack text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue"
										/>
									</div>
									<div>
										<label className="block text-xs text-gray-400 mb-1">
											Price ($)
										</label>
										<input
											type="number"
											min={0}
											step="0.01"
											value={service.price}
											onChange={(e) =>
												handleServiceChange(
													i,
													"price",
													parseFloat(e.target.value) || 0,
												)
											}
											className="w-full bg-revDeskBlack text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue"
										/>
									</div>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Notes
									</label>
									<textarea
										value={service.notes}
										onChange={(e) =>
											handleServiceChange(i, "notes", e.target.value)
										}
										rows={2}
										className="w-full bg-revDeskBlack text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue resize-none"
									/>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={addService}
							className="w-9 h-9 flex items-center justify-center rounded-full bg-revDeskGreen hover:bg-revDeskGreen/80 text-white transition-colors">
							<FontAwesomeIcon icon={faPlus} className="w-4" />
						</button>
					</div>

					<div className="text-right text-sm text-gray-400">
						Total:{" "}
						<span className="text-lg font-bold text-revDeskGreen">
							${total.toFixed(2)}
						</span>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-revDeskBlue hover:bg-revDeskBlue/80 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditInvoiceModal;
