"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateInvoiceModal from "./CreateInvoiceModal";
import { Customer } from "@/lib/firebase/firestore";

const AddInvoiceButton = ({ customers }: { customers: Customer[] }) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="flex items-center gap-2 bg-revDeskBlue hover:bg-revDeskBlue/80 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors">
				<FontAwesomeIcon icon={faPlus} className="w-3.5" />
				New Invoice
			</button>
			{open && (
				<CreateInvoiceModal
					customers={customers}
					onClose={() => setOpen(false)}
					onCreated={() => router.refresh()}
				/>
			)}
		</>
	);
};

export default AddInvoiceButton;
