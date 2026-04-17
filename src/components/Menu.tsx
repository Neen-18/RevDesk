"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFileInvoiceDollar,
	faGear,
	faHouse,
	faRightFromBracket,
	faUser,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const menuItems = [
	{
		title: "GENERAL",
		items: [{ icon: faHouse, label: "Home", href: "/admin" }],
	},
	{
		title: "PEOPLE",
		items: [
			{ icon: faUser, label: "Employees", href: "/employees" },
			{ icon: faUserGroup, label: "Customers", href: "/customers" },
		],
	},
	{
		title: "BUSINESS",
		items: [
			{ icon: faFileInvoiceDollar, label: "Invoices", href: "/invoices" },
		],
	},
	{
		title: "OTHER",
		items: [
			{ icon: faUser, label: "Profile", href: "/profile" },
			{ icon: faGear, label: "Settings", href: "/admin" }, // Don't have this implemented so just redirect to home
		],
	},
];

const Menu = ({ basePath = "" }: { basePath?: string }) => {
	const router = useRouter();

	const handleLogout = async () => {
		await signOut(auth);
		router.push("/sign-in");
	};

	return (
		<div className="mt-4 text-sm">
			{menuItems.map((i) => (
				<div className="flex flex-col gap-2" key={i.title}>
					<span className="hidden lg:block text-revDeskBlue font-semibold my-4">
						{i.title}
					</span>
					{i.items.map((item) => (
						<Link
							href={`${basePath}${item.href}`}
							key={item.label}
							className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:text-revDeskBlue font-light">
							<FontAwesomeIcon icon={item.icon} className="text-white w-5" />
							<span className="hidden lg:block">{item.label}</span>
						</Link>
					))}
				</div>
			))}
			{/* LOGOUT */}
			<div className="flex flex-col gap-2">
				<span className="hidden lg:block text-revDeskBlue font-semibold my-4">
					ACCOUNT
				</span>
				<button
					onClick={handleLogout}
					className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:text-revDeskBlue font-light w-full cursor-pointer">
					<FontAwesomeIcon
						icon={faRightFromBracket}
						className="text-white w-5"
					/>
					<span className="hidden lg:block">Logout</span>
				</button>
			</div>
		</div>
	);
};

export default Menu;
