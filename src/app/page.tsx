import { Slack } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-w-screen min-h-screen">
			<main className="flex flex-col gap-4 sm:p-4 md:p-16 lg:p-16">
				<div className="flex flex-col items-center justify-center text-center">
					<h1 className="text-7xl font-extrabold">Shoverglade</h1>
					<p>
						Reserve shower spots during Hack Clubs Overglade event!
					</p>
				</div>

				<div className="flex flex-col items-center justify-center text-center">
					<p>
						We all hate waiting... How about we just tell others
						when we will shower, so they can plan their day better!
					</p>
					<p>
						The mission behind Shoverglade is that I want to make
						the usage of the shower as fluent as possible. If 40
						participants shower each day, and everyone needs 10
						minutes, that makes a total of 6.66666h per day - time,
						that could be used better than spent by waiting.
					</p>
				</div>

				<div className="flex flex-col items-center justify-center">
					<h2 className="text-4xl font-extrabold">Sign up now!</h2>
					<p>
						The plan is easy: Sign in with Slack, reserve a spot,
						and you&apos;re good to go!
					</p>
					<Link
						href="/auth/login"
						className="flex flex-row gap-2 items-center justify-center bg-purple-600 rounded-xl py-4 px-6 text-2xl font-extrabold text-center mt-4"
					>
						<Slack />
						Sign In
					</Link>
				</div>
			</main>
		</div>
	);
}
