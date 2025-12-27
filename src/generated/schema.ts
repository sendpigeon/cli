export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Health check response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            status: "ok" | "error";
                            timestamp: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Webhook processed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid webhook */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Current billing info */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            subscription: {
                                /** @enum {string} */
                                plan: "FREE" | "EARLY_BIRD" | "STARTER" | "PRO";
                                status: string | null;
                                currentPeriodStart: string | null;
                                currentPeriodEnd: string | null;
                            };
                            usage: {
                                periodStart: string;
                                periodEnd: string;
                                emailCount: number;
                                emailLimit: number;
                                percentUsed: number;
                                domainCount: number;
                                domainLimit: number | null;
                            };
                            limits: {
                                emailLimit: number;
                                domainLimit: number | null;
                            };
                            features: {
                                webhooksEnabled: boolean;
                                logRetentionDays: number;
                            };
                            canUpgrade: boolean;
                            canManageSubscription: boolean;
                        };
                    };
                };
                /** @description Organization not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/checkout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        plan: "STARTER" | "PRO";
                        /** Format: uri */
                        successUrl: string;
                        /** Format: uri */
                        cancelUrl: string;
                    };
                };
            };
            responses: {
                /** @description Checkout session URL */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            url: string;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/billing/portal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** Format: uri */
                        returnUrl: string;
                    };
                };
            };
            responses: {
                /** @description Portal session URL */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            url: string;
                        };
                    };
                };
                /** @description No subscription to manage */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbound/emails": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    cursor?: string;
                    limit?: number;
                    domainId?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of inbound emails */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            emails: {
                                id: string;
                                fromAddress: string;
                                toAddress: string;
                                subject: string;
                                textBody: string | null;
                                attachmentCount: number;
                                processedAt: string;
                                forwardedAt: string | null;
                                webhookSentAt: string | null;
                            }[];
                            nextCursor: string | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inbound/emails/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Inbound email detail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            id: string;
                            fromAddress: string;
                            toAddress: string;
                            subject: string;
                            textBody: string | null;
                            attachmentCount: number;
                            processedAt: string;
                            forwardedAt: string | null;
                            webhookSentAt: string | null;
                            rawUrl: string | null;
                        };
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    status?: "pending" | "sent" | "delivered" | "bounced" | "complained" | "failed";
                    domainId?: string;
                    recipient?: string;
                    cursor?: string;
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Paginated list of email logs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                id: string;
                                fromAddress: string;
                                toAddress: string;
                                ccAddress: string | null;
                                bccAddress: string | null;
                                subject: string;
                                /** @enum {string} */
                                status: "pending" | "sent" | "delivered" | "bounced" | "complained" | "failed";
                                isTest: boolean;
                                createdAt: string;
                                sentAt: string | null;
                                deliveredAt: string | null;
                                bouncedAt: string | null;
                            }[];
                            nextCursor: string | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/logs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Email log detail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            id: string;
                            fromAddress: string;
                            toAddress: string;
                            ccAddress: string | null;
                            bccAddress: string | null;
                            subject: string;
                            /** @enum {string} */
                            status: "pending" | "sent" | "delivered" | "bounced" | "complained" | "failed";
                            createdAt: string;
                            sentAt: string | null;
                            deliveredAt: string | null;
                            bouncedAt: string | null;
                            complainedAt: string | null;
                            bounceType: string | null;
                            complaintType: string | null;
                            attachments: components["schemas"]["AttachmentMeta"][] | null;
                            hasBody: boolean;
                        };
                    };
                };
                /** @description Email not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/logs/{id}/body": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Email body content */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            html: string | null;
                            text: string | null;
                        };
                    };
                };
                /** @description Email or body not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Dashboard statistics */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            sent: number;
                            delivered: number;
                            bounced: number;
                            complained: number;
                            pending: number;
                            deliveryRate: number;
                            trends: {
                                sent: {
                                    value: number;
                                    /** @enum {string} */
                                    direction: "up" | "down" | "flat" | "new";
                                };
                                delivered: {
                                    value: number;
                                    /** @enum {string} */
                                    direction: "up" | "down" | "flat" | "new";
                                };
                                deliveryRate: {
                                    value: number;
                                    /** @enum {string} */
                                    direction: "up" | "down" | "flat" | "new";
                                };
                                bounced: {
                                    value: number;
                                    /** @enum {string} */
                                    direction: "up" | "down" | "flat" | "new";
                                };
                            };
                            recentEmails: {
                                id: string;
                                toAddress: string;
                                subject: string;
                                /** @enum {string} */
                                status: "pending" | "sent" | "delivered" | "bounced" | "complained" | "failed";
                                domain: string | null;
                                createdAt: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/suppressions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    limit?: number | null;
                    offset?: number | null;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of suppressed emails */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                id: string;
                                email: string;
                                reason: string;
                                sourceEmailId: string | null;
                                createdAt: string;
                            }[];
                            total: number;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/suppressions/{email}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    email: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Removed from suppression list */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/api-keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of API keys */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiKey"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateApiKeyRequest"];
                };
            };
            responses: {
                /** @description Created API key with secret */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ApiKeyWithSecret"];
                    };
                };
                /** @description Domain not found */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/api-keys/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/domains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of domains */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DomainListItem"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateDomainRequest"];
                };
            };
            responses: {
                /** @description Created domain with DNS records */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DomainWithDnsRecords"];
                    };
                };
                /** @description Domain already exists or invalid */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/domains/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Domain with DNS records */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DomainWithDnsRecords"];
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deleted */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/domains/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Verification result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DomainVerificationResult"];
                    };
                };
                /** @description Not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Domain already verified by another account */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Email provider setup failed */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/domains/{id}/inbound": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Inbound config with MX instructions */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            mode: "disabled" | "forward" | "webhook";
                            forwardTo: string | null;
                            webhookUrl: string | null;
                            hasSecret: boolean;
                            mxRecords: {
                                priority: number;
                                host: string;
                            }[];
                            mxConfigured: boolean;
                        };
                    };
                };
                /** @description Domain not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @enum {string} */
                        mode: "disabled" | "forward" | "webhook";
                        /** Format: email */
                        forwardTo?: string;
                        /** Format: uri */
                        webhookUrl?: string;
                    };
                };
            };
            responses: {
                /** @description Updated inbound config */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            mode: "disabled" | "forward" | "webhook";
                            forwardTo: string | null;
                            webhookUrl: string | null;
                            hasSecret: boolean;
                            mxRecords: {
                                priority: number;
                                host: string;
                            }[];
                            mxConfigured: boolean;
                        };
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Inbound not available on current plan */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Domain not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Inbound email infrastructure not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/domains/{id}/inbound/secret": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description New webhook secret */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            secret: string;
                        };
                    };
                };
                /** @description Domain not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/domains/{id}/inbound/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Test webhook result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            statusCode: number | null;
                            error: string | null;
                        };
                    };
                };
                /** @description Webhook not configured */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Domain not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/templates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all templates */
        get: operations["listTemplates"];
        put?: never;
        /**
         * Create a template
         * @description Create a reusable email template with {{variable}} placeholders.
         */
        post: operations["createTemplate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/templates/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a template */
        get: operations["getTemplate"];
        put?: never;
        post?: never;
        /** Delete a template */
        delete: operations["deleteTemplate"];
        options?: never;
        head?: never;
        /** Update a template */
        patch: operations["updateTemplate"];
        trace?: never;
    };
    "/v1/emails": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send an email
         * @description Send a transactional email. Requires a verified domain. Supports templates with variable substitution.
         */
        post: operations["sendEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/emails/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send batch emails
         * @description Send up to 100 emails in a single request. Returns per-email status.
         */
        post: operations["sendBatchEmails"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/emails/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get email details
         * @description Get the details and delivery status of an email by ID.
         */
        get: operations["getEmail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/emails/{id}/schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Cancel scheduled email
         * @description Cancel a scheduled email before it is sent.
         */
        delete: operations["cancelScheduledEmail"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/invitations/pending": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of pending invitations for the authenticated user */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            invitations: {
                                id: string;
                                organizationId: string;
                                organizationName: string;
                                role: string;
                                expiresAt: string;
                            }[];
                        };
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/sns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Webhook processed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid signature */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/sns/inbound": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": unknown;
                    "text/plain": unknown;
                };
            };
            responses: {
                /** @description Processed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            message: string;
                        };
                    };
                };
                /** @description Invalid signature or topic */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            message: string;
                        };
                    };
                };
                /** @description Inbound not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            message: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Webhook configuration */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            url: string | null;
                            enabled: boolean;
                            hasSecret: boolean;
                            events: string[];
                        };
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** Format: uri */
                        url: string;
                        events: ("email.delivered" | "email.bounced" | "email.complained")[];
                    };
                };
            };
            responses: {
                /** @description Webhook updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                        };
                    };
                };
                /** @description Webhook not configured */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/config/enable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** Format: uri */
                        url: string;
                        events: ("email.delivered" | "email.bounced" | "email.complained")[];
                    };
                };
            };
            responses: {
                /** @description Webhook enabled, secret returned */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            secret: string;
                        };
                    };
                };
                /** @description Invalid URL */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Webhooks not available on FREE tier */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/config/disable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Webhook disabled */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/config/regenerate-secret": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description New secret generated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            secret: string;
                        };
                    };
                };
                /** @description Webhook not configured */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/config/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Test result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                            statusCode?: number;
                            error?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/config/deliveries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of webhook deliveries */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            deliveries: {
                                id: string;
                                emailId: string | null;
                                event: string;
                                url: string;
                                status: string;
                                statusCode: number | null;
                                attempts: number;
                                lastAttemptAt: string | null;
                                error: string | null;
                                createdAt: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/config/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "text/plain": string;
                };
            };
            responses: {
                /** @description Signature verification result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            valid: boolean;
                            error?: string;
                        };
                    };
                };
                /** @description Missing headers or webhook not configured */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Error: {
            /** @example Invalid request */
            message: string;
            /** @example VALIDATION_ERROR */
            code?: string;
        };
        AttachmentMeta: {
            /** @example invoice.pdf */
            filename: string;
            /** @example 102400 */
            size: number;
            /** @example application/pdf */
            contentType: string;
        };
        ApiKeyDomainRef: {
            id: string;
            name: string;
        } | null;
        ApiKey: {
            id: string;
            name: string;
            keyPrefix: string;
            /** @enum {string} */
            mode: "live" | "test";
            /** @enum {string} */
            permission: "full_access" | "sending";
            lastUsedAt: string | null;
            expiresAt: string | null;
            createdAt: string;
            domain: components["schemas"]["ApiKeyDomainRef"];
        };
        ApiKeyWithSecret: components["schemas"]["ApiKey"] & {
            key: string;
        };
        CreateApiKeyRequest: {
            name: string;
            /**
             * @default live
             * @enum {string}
             */
            mode: "live" | "test";
            /**
             * @default full_access
             * @enum {string}
             */
            permission: "full_access" | "sending";
            /** Format: date-time */
            expiresAt?: string;
            domainId?: string;
        };
        Domain: {
            id: string;
            name: string;
            /** @enum {string} */
            status: "pending" | "verified" | "temporary_failure" | "failed";
            verifiedAt: string | null;
            lastCheckedAt: string | null;
            failingSince: string | null;
            createdAt: string;
        };
        DomainListItem: components["schemas"]["Domain"] & {
            /** @enum {string} */
            inboundMode: "disabled" | "forward" | "webhook";
            inboundReady: boolean;
        };
        DnsRecord: {
            /** @enum {string} */
            key: "dkim" | "mx" | "spf" | "dmarc";
            /** @enum {string} */
            type: "CNAME" | "TXT" | "MX";
            name: string;
            value: string;
            priority?: number;
        };
        DomainWithDnsRecords: components["schemas"]["Domain"] & {
            dnsRecords: components["schemas"]["DnsRecord"][];
        };
        CreateDomainRequest: {
            name: string;
        };
        RecordStatus: {
            found: boolean;
            valid: boolean;
        };
        VerificationStatus: {
            verified: boolean;
            dkim: components["schemas"]["RecordStatus"];
            mx: components["schemas"]["RecordStatus"];
            spf: components["schemas"]["RecordStatus"];
            dmarc: components["schemas"]["RecordStatus"];
        };
        DomainVerificationResult: {
            domain: components["schemas"]["Domain"];
            verification: components["schemas"]["VerificationStatus"];
        };
        /** @description Domain this template is scoped to (null = org-wide) */
        TemplateDomain: {
            /** @example dom_abc123 */
            id: string;
            /** @example example.com */
            name: string;
        } | null;
        Template: {
            /** @example tpl_abc123 */
            id: string;
            /** @example welcome-email */
            name: string;
            /** @example Welcome to {{company}}, {{name}}! */
            subject: string;
            /** @description HTML template with {{variable}} placeholders */
            html: string | null;
            /** @description Plain text template with {{variable}} placeholders */
            text: string | null;
            /**
             * @description Detected variable names
             * @example [
             *       "name",
             *       "company"
             *     ]
             */
            variables: string[];
            domain: components["schemas"]["TemplateDomain"];
            /** @example 2024-01-15T10:30:00Z */
            createdAt: string;
            /** @example 2024-01-15T10:30:00Z */
            updatedAt: string;
        };
        CreateTemplateRequest: {
            /**
             * @description Unique template identifier (lowercase, dashes allowed)
             * @example welcome-email
             */
            name: string;
            /**
             * @description Email subject with optional {{variables}}
             * @example Welcome to {{company}}!
             */
            subject: string;
            /** @description HTML body with {{variable}} placeholders */
            html?: string;
            /** @description Plain text body with {{variable}} placeholders */
            text?: string;
            /**
             * @description Scope template to a specific domain (omit for org-wide)
             * @example dom_abc123
             */
            domainId?: string;
        };
        UpdateTemplateRequest: {
            name?: string;
            subject?: string;
            html?: string | null;
            text?: string | null;
            /** @description Domain to scope template to (null to make org-wide) */
            domainId?: string | null;
        };
        SendEmailResponse: {
            /**
             * @description Unique email ID
             * @example em_abc123
             */
            id: string;
            /**
             * @description Current email status
             * @example sent
             * @enum {string}
             */
            status: "scheduled" | "cancelled" | "pending" | "sent" | "delivered" | "bounced" | "complained" | "failed";
            /**
             * Format: date-time
             * @description Scheduled send time (only if scheduled)
             * @example 2024-01-15T10:00:00Z
             */
            scheduled_at?: string;
            /** @description List of suppressed recipient addresses (bounced/complained previously) */
            suppressed?: string[];
        };
        AttachmentInput: {
            /** @example invoice.pdf */
            filename: string;
            /**
             * @description MIME type (inferred from filename if omitted)
             * @example application/pdf
             */
            contentType?: string;
            /** @description Base64-encoded file content */
            content?: string;
            /**
             * Format: uri
             * @description URL to fetch attachment from (HTTPS only)
             * @example https://example.com/invoice.pdf
             */
            path?: string;
        };
        SendEmailRequest: {
            /**
             * @description Sender email address. Accepts 'email@domain.com' or 'Name <email@domain.com>'. Domain must be verified.
             * @example Acme <hello@yourdomain.com>
             */
            from: string;
            /**
             * @description Recipient email address(es). Can be a single email or array.
             * @example user@example.com
             */
            to: string | string[];
            /** @description CC recipients */
            cc?: string | string[];
            /** @description BCC recipients */
            bcc?: string | string[];
            /**
             * @description Email subject. Required unless using templateId.
             * @example Welcome to Acme!
             */
            subject?: string;
            /** @description HTML body content */
            html?: string;
            /** @description Plain text body content */
            text?: string;
            /** @description Reply-to address */
            replyTo?: string;
            /** @description Template ID to use instead of subject/body */
            templateId?: string;
            /**
             * @description Variables to substitute in template
             * @example {
             *       "name": "John",
             *       "company": "Acme"
             *     }
             */
            variables?: {
                [key: string]: string;
            };
            /** @description File attachments. Provide content (base64) or path (URL). */
            attachments?: components["schemas"]["AttachmentInput"][];
            /**
             * @description Tags for filtering and analytics. Max 5 tags, 50 chars each.
             * @example [
             *       "order",
             *       "confirmation"
             *     ]
             */
            tags?: string[];
            /**
             * @description Custom key-value pairs. Returned in webhooks and logs. Max 500 chars per value.
             * @example {
             *       "orderId": "12345",
             *       "userId": "abc"
             *     }
             */
            metadata?: {
                [key: string]: string;
            };
            /**
             * @description Custom email headers. Use for X-Priority, List-Unsubscribe, etc.
             * @example {
             *       "X-Priority": "1",
             *       "List-Unsubscribe": "<mailto:unsub@example.com>"
             *     }
             */
            headers?: {
                [key: string]: string;
            };
            /**
             * Format: date-time
             * @description ISO 8601 datetime to send email. Max 30 days ahead. Omit to send immediately.
             * @example 2024-01-15T10:00:00Z
             */
            scheduled_at?: string;
        };
        BatchEmailResult: {
            /** @description Index in request array */
            index: number;
            /** @enum {string} */
            status: "sent";
            /** @example em_abc123 */
            id: string;
            suppressed?: string[];
        } | {
            /** @description Index in request array */
            index: number;
            /** @enum {string} */
            status: "error";
            error: {
                /** @example DOMAIN_NOT_VERIFIED */
                code: string;
                /** @example Domain not verified */
                message: string;
            };
        };
        SendBatchEmailResponse: {
            data: components["schemas"]["BatchEmailResult"][];
            summary: {
                total: number;
                sent: number;
                failed: number;
            };
        };
        BatchEmailEntry: {
            /**
             * @description Sender email address. Domain must be verified.
             * @example Acme <hello@yourdomain.com>
             */
            from: string;
            /**
             * @description Recipient email address(es).
             * @example user@example.com
             */
            to: string | string[];
            cc?: string | string[];
            bcc?: string | string[];
            /**
             * @description Required unless using templateId.
             * @example Welcome!
             */
            subject?: string;
            html?: string;
            text?: string;
            replyTo?: string;
            templateId?: string;
            variables?: {
                [key: string]: string;
            };
            attachments?: components["schemas"]["AttachmentInput"][];
            tags?: string[];
            metadata?: {
                [key: string]: string;
            };
            headers?: {
                [key: string]: string;
            };
            /** @description Unique key to prevent duplicate sends for this email. */
            idempotencyKey?: string;
            /**
             * Format: date-time
             * @description ISO 8601 datetime to send. Max 30 days ahead.
             * @example 2024-01-15T10:00:00Z
             */
            scheduled_at?: string;
        };
        SendBatchEmailRequest: {
            /** @description Array of emails to send (1-100) */
            emails: components["schemas"]["BatchEmailEntry"][];
        };
        EmailDetailResponse: {
            /** @example em_abc123 */
            id: string;
            /** @example hello@yourdomain.com */
            fromAddress: string;
            /** @example user@example.com */
            toAddress: string;
            ccAddress: string | null;
            bccAddress: string | null;
            /** @example Welcome to Acme! */
            subject: string;
            /** @enum {string} */
            status: "scheduled" | "cancelled" | "pending" | "sent" | "delivered" | "bounced" | "complained" | "failed";
            tags: string[];
            metadata: {
                [key: string]: string;
            } | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            sentAt: string | null;
            /** Format: date-time */
            deliveredAt: string | null;
            /** Format: date-time */
            bouncedAt: string | null;
            /** Format: date-time */
            complainedAt: string | null;
            bounceType: string | null;
            complaintType: string | null;
            attachments: components["schemas"]["AttachmentMeta"][] | null;
            hasBody: boolean;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listTemplates: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of templates */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Template"][];
                };
            };
        };
    };
    createTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateTemplateRequest"];
            };
        };
        responses: {
            /** @description Template created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Template"];
                };
            };
            /** @description Template name already exists or invalid format */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Template limit reached. Upgrade plan. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Template details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Template"];
                };
            };
            /** @description Template not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Template deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Template not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateTemplateRequest"];
            };
        };
        responses: {
            /** @description Template updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Template"];
                };
            };
            /** @description Template name already exists */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Template not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    sendEmail: {
        parameters: {
            query?: never;
            header?: {
                "idempotency-key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["SendEmailRequest"];
            };
        };
        responses: {
            /** @description Email accepted for delivery */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SendEmailResponse"];
                };
            };
            /** @description Invalid request body or missing template variables */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid API key */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Monthly email quota exceeded. Upgrade plan to continue. */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Sender domain not verified. Add DNS records first. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limit exceeded. Slow down requests. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    sendBatchEmails: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["SendBatchEmailRequest"];
            };
        };
        responses: {
            /** @description Batch processed. Check data array for per-email results. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SendBatchEmailResponse"];
                };
            };
            /** @description Invalid request body */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Missing or invalid API key */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Insufficient quota for batch */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Sending disabled for organization */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Rate limit exceeded */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Internal server error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getEmail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Email details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmailDetailResponse"];
                };
            };
            /** @description Missing or invalid API key */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Email not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    cancelScheduledEmail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Email schedule cancelled */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Missing or invalid API key */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Email not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Email is not scheduled */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
}
