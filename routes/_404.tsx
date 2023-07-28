import { Head } from "$fresh/runtime.ts";

export default function Error404() {
    return (
        <>
            <Head>
                <title>404 - Page not found</title>
            </Head>
            <div class="px-4 py-8 mx-auto h-screen flex">
                <div class="max-w-screen-md mx-auto flex flex-col gap-3 items-center justify-center">
                    <img
                        src="/logo.svg"
                        width="128"
                        height="128"
                        alt="the fresh logo: a sliced lemon dripping with juice"
                    />

                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl break-words">
                        404 - Page not found
                    </h1>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        The page you were looking for doesn't exist.
                    </p>
                    <a href="/" class="underline">Go back home</a>
                </div>
            </div>
        </>
    );
}
