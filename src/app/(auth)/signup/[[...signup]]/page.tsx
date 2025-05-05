import { SignUp } from "@clerk/nextjs";

const page = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center">
			<SignUp />
		</div>
	);
};

export default page;
