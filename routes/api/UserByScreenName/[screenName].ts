import { Handlers } from "$fresh/server.ts";
import { z } from "zod";

const TWITTER_GUEST_BEARER_TOKEN =
    `AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA`;

async function fetchGuestToken() {
    const scheme = z.object({
        guest_token: z.string(),
    });

    const req = await fetch("https://api.twitter.com/1.1/guest/activate.json", {
        headers: {
            authorization: `Bearer ${TWITTER_GUEST_BEARER_TOKEN}`,
        },
        method: "POST",
    });

    if (!req.ok) {
        throw new Error(`Failed to fetch guest token: ${req.statusText}`);
    }

    const res = scheme.parse(await req.json());
    const { guest_token } = res;

    return guest_token;
}

async function fetchUserByScreenName(screenName: string, guestToken: string) {
    const scheme = z.any();

    const query = {
        variables: {
            screen_name: screenName,
            withSafetyModeUserFields: true,
        },
        features: {
            "hidden_profile_likes_enabled": false,
            "hidden_profile_subscriptions_enabled": false,
            "responsive_web_graphql_exclude_directive_enabled": true,
            "verified_phone_label_enabled": false,
            "subscriptions_verification_info_verified_since_enabled": true,
            "highlights_tweets_tab_ui_enabled": true,
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled":
                false,
            "responsive_web_graphql_timeline_navigation_enabled": true,
        },
    };

    const req = await fetch(
        `https://twitter.com/i/api/graphql/xc8f1g7BYqr6VTzTbvNlGw/UserByScreenName?` +
            [
                `variables=${
                    encodeURIComponent(JSON.stringify(query.variables))
                }`,
                `features=${
                    encodeURIComponent(JSON.stringify(query.features))
                }`,
            ].join("&"),
        {
            headers: {
                authorization: `Bearer ${TWITTER_GUEST_BEARER_TOKEN}`,
                "x-guest-token": guestToken,
            },
        },
    );

    if (!req.ok) {
        throw new Error(
            `Failed to fetch user by screen name: ${req.statusText}`,
        );
    }

    const res = scheme.parse(await req.json());
    const { data } = res;

    return data;
}

export async function fetchData(
    screenName: string,
) {
    const guestToken = await fetchGuestToken();
    const data = await fetchUserByScreenName(screenName, guestToken);

    return data;
}

export const handler: Handlers = {
    async GET(_req, ctx) {
        try {
            const targetScreenName = ctx.params.screenName;
            const data = await fetchData(targetScreenName);
            return new Response(
                JSON.stringify({
                    success: true,
                    data,
                }),
                {
                    status: 200,
                    headers: { "content-type": "application/json" },
                },
            );
        } catch (error) {
            const message = `oops!`;

            return new Response(
                JSON.stringify({
                    success: false,
                    error: [message, error.message].join("\n"),
                }),
                {
                    status: 500,
                    headers: { "content-type": "application/json" },
                },
            );
        }
    },
};
