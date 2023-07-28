import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { fetchData } from "@/routes/api/UserByScreenName/[screenName].ts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert.tsx";
import { Input } from "@/components/ui/Input.tsx";
import IconTerminal from "https://deno.land/x/tabler_icons_tsx@0.0.4/tsx/terminal.tsx";
import IconBrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.4/tsx/brand-github.tsx";

interface ResultSuccess {
    success: true;
    data: any;
}

interface ResultError {
    success: false;
    error: any;
}

type Result = ResultSuccess | ResultError;

interface Data {
    result: Result | null;
    query: string;
}

export const handler: Handlers<Data> = {
    async GET(req, ctx) {
        const url = new URL(req.url);
        const query = url.searchParams.get("q");
        if (query === null) {
            return ctx.render({
                result: null,
                query: "",
            });
        }

        try {
            const data = await fetchData(query);
            return ctx.render({
                result: {
                    success: true,
                    data,
                },
                query,
            });
        } catch (error) {
            return ctx.render({
                result: {
                    success: false,
                    error: error.message,
                },
                query,
            });
        }
    },
};

export default function Home({ data }: PageProps<Data>) {
    const { result, query } = data;
    return (
        <>
            <Head>
                <title>x-user-by-screen-name</title>
                <link rel="stylesheet" href="styles.css" />
            </Head>
            <div class="mx-auto grid grid-cols-1 md:grid-cols-2 h-full">
                <div class="h-full justify-center p-6 border-e">
                    <div class="container m-auto flex flex-col gap-8">
                        <div class="flex flex-col gap-2 relative">
                            <div class="flex items-center">
                                <img
                                    class="h-24 w-24"
                                    src="/logo.svg"
                                    alt="the fresh logo: a sliced lemon dripping with juice"
                                />
                                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl break-words">
                                    x-user-by-screen-name
                                </h1>
                            </div>
                        </div>
                        <form class="flex gap-2">
                            <Input
                                type="text"
                                name="q"
                                value={query}
                                placeholder="jack"
                            />
                        </form>

                        <div class="flex flex-col gap-2">
                            <Alert>
                                <IconTerminal class="w-4 h-4" />
                                <AlertTitle>API Available!</AlertTitle>
                                <AlertDescription>
                                    Try{" "}
                                    <a
                                        href="/api/UserByScreenName/jack"
                                        target="_blank"
                                    >
                                        <code class="hover:underline p-1 break-words">
                                            /api/UserByScreenName/[screenName]
                                        </code>
                                    </a>
                                    to get user data from API!
                                </AlertDescription>
                            </Alert>
                            <Alert>
                                <IconBrandGithub class="w-4 h-4" />
                                <AlertTitle>Source Code</AlertTitle>
                                <AlertDescription>
                                    <a
                                        href="https://github.com/eai04191/x-user-by-screen-name"
                                        target="_blank"
                                    >
                                        <code class="hover:underline">
                                            github.com/eai04191/x-user-by-screen-name
                                        </code>
                                    </a>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </div>
                <textarea
                    class="min-h-screen max-h-screen overflow-auto p-6 bg-[color:var(--background)]"
                    readonly
                >
                    {result === null
                        ? (
                            "No query"
                        )
                        : result.success
                        ? (
                            JSON.stringify(result.data, null, 2)
                        )
                        : (
                            result.error
                        )}
                </textarea>
            </div>
        </>
    );
}
