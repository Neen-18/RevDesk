"use client";

import { useState } from "react";
import { createInvoice, createCustomer } from "@/lib/firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Field from "@/components/Field";
import {
	Customer,
	INVOICE_STATUS,
	InvoiceStatus,
	PAYMENT_TYPES,
	ServiceLine,
	VEHICLE_TYPES,
} from "@/lib/types";

type Props = {
	onClose: () => void;
	onCreated: () => void;
	customers: Customer[];
};

const emptyService = (): ServiceLine => ({
	vehicleType: "SUV",
	serviceType: "",
	quantity: 1,
	price: 0,
	notes: "",
});

const INITIAL_CUSTOMER = {
	customerId: "",
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	address: "",
};

const CreateInvoiceModal = ({ onClose, onCreated, customers }: Props) => {
	const [customerForm, setCustomerForm] = useState(INITIAL_CUSTOMER);
	const [status, setStatus] = useState<InvoiceStatus>("Draft");
	const [paymentType, setPaymentType] = useState("-- Select --");
	const [services, setServices] = useState<ServiceLine[]>([emptyService()]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);

	const filteredCustomers = customers.filter((c) =>
		`${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()),
	);

	const selectCustomer = (c: Customer) => {
		setCustomerForm({
			customerId: c.id,
			firstName: c.firstName,
			lastName: c.lastName,
			email: c.email,
			phone: c.phone,
			address: [c.streetAddress1, c.streetAddress2].filter(Boolean).join(", "),
		});
		setSearch(`${c.firstName} ${c.lastName}`);
		setShowDropdown(false);
	};

	const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomerForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleServiceChange = (
		index: number,
		field: keyof ServiceLine,
		value: string | number,
	) => {
		setServices((prev) =>
			prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
		);
	};

	const addService = () => setServices((prev) => [...prev, emptyService()]);
	const removeService = (index: number) =>
		setServices((prev) => prev.filter((_, i) => i !== index));

	const total = services.reduce((sum, s) => sum + s.quantity * s.price, 0);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			let customerId = customerForm.customerId;
			if (!customerId) {
				customerId = await createCustomer({
					firstName: customerForm.firstName,
					lastName: customerForm.lastName,
					email: customerForm.email,
					phone: customerForm.phone,
					streetAddress1: customerForm.address,
					streetAddress2: "",
					postalCode: "",
					notes: "",
				});
			}
			await createInvoice({
				customerId,
				customerName: `${customerForm.firstName} ${customerForm.lastName}`,
				phone: customerForm.phone,
				email: customerForm.email,
				address: customerForm.address,
				status,
				paymentType,
				services,
				amount: total,
			});
			onCreated();
			onClose();
		} catch (err) {
			console.error("Failed to create invoice:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-revDeskPink-dark w-full max-w-5xl rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white">
					<FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
				</button>

				<h2 className="text-xl font-bold text-revDeskPurple-dark mb-6">
					Create New Invoice
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-2 gap-8">
						{/* Left side of invoice modal*/}
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<span className="text-xs font-semibold text-revDeskPurple-light uppercase tracking-widest whitespace-nowrap">
									Customer Information
								</span>
								<div className="flex-1 h-px bg-white/10" />
							</div>

							{/* Customer search */}
							<div className="relative">
								<label className="block text-xs text-gray-500 mb-1">
									Select Existing Customer
								</label>
								<div className="relative">
									<input
										type="text"
										placeholder="Search for a customer..."
										value={search}
										onChange={(e) => {
											setSearch(e.target.value);
											setShowDropdown(true);
											setCustomerForm((p) => ({ ...p, customerId: "" }));
										}}
										onFocus={() => setShowDropdown(true)}
										onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
										className="w-full bg-revDeskBlack-dark text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskPurple-dark"
									/>
									{showDropdown && search && filteredCustomers.length > 0 && (
										<ul className="absolute z-10 w-full mt-1 bg-revDeskBlack-light border border-white/10 rounded-lg overflow-hidden shadow-xl">
											{filteredCustomers.slice(0, 5).map((c) => (
												<li
													key={c.id}
													onMouseDown={() => selectCustomer(c)}
													className="px-3 py-2 text-sm text-white hover:bg-revDeskPurple-dark/20 cursor-pointer">
													{c.firstName} {c.lastName}
													<span className="text-xs text-gray-500 ml-2">
														{c.email}
													</span>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<Field
									label="First Name"
									name="firstName"
									value={customerForm.firstName}
									onChange={handleCustomerChange}
								/>
								<Field
									label="Last Name"
									name="lastName"
									value={customerForm.lastName}
									onChange={handleCustomerChange}
								/>
								<Field
									label="Email"
									name="email"
									type="email"
									value={customerForm.email}
									onChange={handleCustomerChange}
								/>
								<Field
									label="Phone"
									name="phone"
									type="tel"
									value={customerForm.phone}
									onChange={handleCustomerChange}
								/>
								<div className="col-span-2">
									<Field
										label="Address"
										name="address"
										value={customerForm.address}
										onChange={handleCustomerChange}
									/>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<span className="text-xs font-semibold text-revDeskPurple-light uppercase tracking-widest whitespace-nowrap">
									Invoice Information
								</span>
								<div className="flex-1 h-px bg-white/10" />
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Invoice Status
									</label>
									<select
										value={status}
										onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
										className="w-full bg-revDeskBlack-dark text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskPurple-dark">
										{INVOICE_STATUS.map((s) => (
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
										className="w-full bg-revDeskBlack-dark text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskPurple-dark">
										{PAYMENT_TYPES.map((p) => (
											<option key={p} value={p}>
												{p}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{/* Right side of invoice modal */}
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<span className="text-xs font-semibold text-revDeskPurple-light uppercase tracking-widest whitespace-nowrap">
									Services
								</span>
								<div className="flex-1 h-px bg-white/10" />
							</div>

							{services.map((service, i) => (
								<div
									key={i}
									className="flex flex-col gap-3 p-4 rounded-xl border border-revDeskPurple-dark/10 bg-revDeskPink relative">
									{services.length > 1 && (
										<button
											type="button"
											onClick={() => removeService(i)}
											className="absolute top-3 right-3 text-revDeskPurple-dark hover:text-red-400">
											<FontAwesomeIcon icon={faTrashCan} className="w-3.5" />
										</button>
									)}
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="block text-xs text-gray-700 mb-1">
												Vehicle Type
											</label>
											<select
												value={service.vehicleType}
												onChange={(e) =>
													handleServiceChange(i, "vehicleType", e.target.value)
												}
												className="w-full bg-revDeskBlack text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskPurple-dark">
												{VEHICLE_TYPES.map((v) => (
													<option key={v} value={v}>
														{v}
													</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-xs text-gray-700 mb-1">
												Service Type
											</label>
											<input
												type="text"
												placeholder="e.g. Oil Change"
												value={service.serviceType}
												onChange={(e) =>
													handleServiceChange(i, "serviceType", e.target.value)
												}
												className="w-full bg-revDeskBlack text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue"
											/>
										</div>
										<div>
											<label className="block text-xs text-gray-700 mb-1">
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
											<label className="block text-xs text-gray-700 mb-1">
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
										<label className="block text-xs text-gray-700 mb-1">
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
								className="self-start w-9 h-9 flex items-center justify-center rounded-full bg-revDeskGreen hover:bg-revDeskGreen/80 text-white transition-colors">
								<FontAwesomeIcon icon={faPlus} className="w-4" />
							</button>

							<div className="mt-auto pt-4 border-t border-white/10 text-right">
								<span className="text-sm text-gray-500">Total: </span>
								<span className="text-lg font-bold text-revDeskGreen">
									${total.toFixed(2)}
								</span>
							</div>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="mt-6 w-full bg-revDeskPurple-dark hover:bg-revDeskPurple-dark/80 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
						{loading ? "Creating..." : "Create"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateInvoiceModal;
