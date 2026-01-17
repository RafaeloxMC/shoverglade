import Link from "next/link";

function LoginPage() {
	return (
		<div className="min-w-screen min-h-screen">
			<main className="flex flex-col gap-4">
				<h1 className="text-7xl font-extrabold">
					Login to Shoverglade
				</h1>
				<Link
					href="/api/v1/auth/slack"
					prefetch={false}
					className="py-2 px-4 bg-purple-700 rounded-xl max-w-36 text-center"
				>
					Login
				</Link>
			</main>
		</div>
	);
}

export default LoginPage;
