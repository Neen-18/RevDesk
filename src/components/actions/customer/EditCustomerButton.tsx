"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import EditCustomerModal from "./EditCustomerModal";
import { Customer } from "@/lib/types";

const EditCustomerButton = ({ customer }: { customer: Customer }) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="flex items-center gap-2 bg-revDeskBlack-light hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
				<FontAwesomeIcon icon={faPen} className="w-3.5" />
				Edit
			</button>
			{open && (
				<EditCustomerModal
					customer={customer}
					onClose={() => setOpen(false)}
					onUpdated={() => router.refresh()}
				/>
			)}
		</>
	);
};

export default EditCustomerButton;
