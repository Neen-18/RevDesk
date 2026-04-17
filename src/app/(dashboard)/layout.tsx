import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen flex">
			{/* LEFT */}
			<div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-revDeskBlack-dark">
				<Link
					href="/admin"
					className="flex items-center justify-center p-2 border-b-2 border-b-gray-600">
					<Image
						src="/static/logo_light.png"
						alt="logo"
						width={130}
						height={130}
					/>
				</Link>
				<Menu />
			</div>
			{/* RIGHT */}
			<div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-revDeskBlack-light overflow-scroll flex flex-col">
				<Navbar />
				{children}
			</div>
		</div>
	);
}
