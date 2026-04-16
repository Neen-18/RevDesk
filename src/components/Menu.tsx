import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFileInvoiceDollar,
	faGear,
	faHouse,
	faRightFromBracket,
	faUser,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
	{
		title: "GENERAL",
		items: [
			{
				icon: faHouse,
				label: "Home",
				href: "/",
			},
		],
	},
	{
		title: "PEOPLE",
		items: [
			{
				icon: faUser,
				label: "Employees",
				href: "/employees",
			},
			{
				icon: faUserGroup,
				label: "Customers",
				href: "/customers",
			},
		],
	},
	{
		title: "BUSINESS",
		items: [
			{
				icon: faFileInvoiceDollar,
				label: "Invoices",
				href: "/invoices",
			},
		],
	},
	{
		title: "OTHER",
		items: [
			{
				icon: faUser,
				label: "Profile",
				href: "/profile",
			},
			{
				icon: faGear,
				label: "Settings",
				href: "/settings",
			},
			{
				icon: faRightFromBracket,
				label: "Logout",
				href: "/logout",
			},
		],
	},
];

const Menu = async ({ basePath = "" }: { basePath?: string }) => {
	return (
		<div className="mt-4 text-sm">
			{menuItems.map((i) => (
				<div className="flex flex-col gap-2" key={i.title}>
					<span className="hidden lg:block text-revDeskBlue font-semibold my-4">
						{i.title}
					</span>
					{i.items.map((item) => {
						return (
							<Link
								href={`${basePath}${item.href}`}
								key={item.label}
								className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:text-revDeskBlue font-light">
								<FontAwesomeIcon icon={item.icon} className="text-white w-5" />
								<span className="hidden lg:block">{item.label}</span>
							</Link>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default Menu;
