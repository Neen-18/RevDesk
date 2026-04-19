"use client";

import { useState } from "react";
import { createCustomer } from "@/lib/firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Field from "../../Field";

type Props = {
	onClose: () => void;
	onCreated: () => void;
};

const INITIAL_FORM_STATE = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	streetAddress1: "",
	streetAddress2: "",
	postalCode: "",
	notes: "",
};

const CreateCustomerModal = ({ onClose, onCreated }: Props) => {
	const [form, setForm] = useState(INITIAL_FORM_STATE);
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await createCustomer(form);
			onCreated();
			onClose();
		} catch (err) {
			console.error("Failed to create customer:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-revDeskPink-dark w-full max-w-2xl rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-600 hover:text-white">
					<FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
				</button>

				<h2 className="text-xl font-bold text-revDeskPurple-dark mb-6">
					Create New Customer
				</h2>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div>
						<p className="text-xs font-semibold text-revDeskPurple-light uppercase tracking-widest mb-3">
							Personal Information
						</p>
						<div className="grid grid-cols-2 gap-4">
							<Field
								label="First Name"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								required
							/>
							<Field
								label="Last Name"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								required
							/>
							<Field
								label="Email"
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								required
							/>
							<Field
								label="Phone"
								name="phone"
								type="tel"
								value={form.phone}
								onChange={handleChange}
							/>
							<Field
								label="Street Address 1"
								name="streetAddress1"
								value={form.streetAddress1}
								onChange={handleChange}
							/>
							<Field
								label="Street Address 2"
								name="streetAddress2"
								value={form.streetAddress2}
								onChange={handleChange}
							/>
							<Field
								label="Postal Code"
								name="postalCode"
								value={form.postalCode}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs text-gray-600 mb-1">Notes</label>
						<textarea
							name="notes"
							value={form.notes}
							onChange={handleChange}
							rows={3}
							className="w-full bg-revDeskBlack-dark text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-revDeskBlue resize-none"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-revDeskPurple-dark hover:bg-revDeskPurple-dark/80 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
						{loading ? "Creating..." : "Create"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateCustomerModal;
