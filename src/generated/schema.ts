export interface paths {
	"/v1/alerts": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: operations["listAlerts"];
		put?: never;
		post?: never;
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/v1/alerts/unread-count": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: operations["getUnreadAlertCount"];
		put?: never;
		post?: never;
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/v1/alerts/{id}/read": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		post: operations["markAlertAsRead"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/v1/alerts/batch/read": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		post: operations["markAllAlertsAsRead"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/v1/alerts/settings": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: operations["getAlertSettings"];
		put?: never;
		post?: never;
		delete?: never;
		options?: never;
		head?: never;
		patch: operations["updateAlertSettings"];
		trace?: never;
	};
	"/analytics/time-series": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: {
			parameters: {
				query?: {
					range?: "7d" | "30d" | "90d";
					domainId?: string;
				};
				header?: never;
				path?: never;
				cookie?: never;
			};
			requestBody?: never;
			responses: {
				/** @description Time series data */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							range: string;
							data: {
								date: string;
								total: number;
								delivered: number;
								bounced: number;
								complained: number;
							}[];
						};
					};
				};
				/** @description Analytics not available on current plan */
				403: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							message: string;
							code: string;
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
	"/analytics/breakdown": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: {
			parameters: {
				query?: {
					range?: "7d" | "30d" | "90d";
					domainId?: string;
				};
				header?: never;
				path?: never;
				cookie?: never;
			};
			requestBody?: never;
			responses: {
				/** @description Status breakdown */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							statuses: {
								status: string;
								count: number;
							}[];
							bounceTypes: {
								bounceType: string;
								count: number;
							}[];
							complaintTypes: {
								complaintType: string;
								count: number;
							}[];
						};
					};
				};
				/** @description Analytics not available on current plan */
				403: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							message: string;
							code: string;
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
	"/analytics/domains": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: {
			parameters: {
				query?: {
					range?: "7d" | "30d" | "90d";
				};
				header?: never;
				path?: never;
				cookie?: never;
			};
			requestBody?: never;
			responses: {
				/** @description Per-domain analytics */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							domains: {
								domainId: string;
								domainName: string;
								sent: number;
								delivered: number;
								bounced: number;
								complained: number;
								deliveryRate: number;
								healthScore: number;
							}[];
						};
					};
				};
				/** @description Analytics not available on current plan */
				403: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							message: string;
							code: string;
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
	"/analytics/quick-stats": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: {
			parameters: {
				query?: {
					range?: "7d" | "30d" | "90d";
				};
				header?: never;
				path?: never;
				cookie?: never;
			};
			requestBody?: never;
			responses: {
				/** @description Quick stats */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							topDomain: {
								name: string;
								count: number;
							} | null;
							busiestDay: {
								day: string;
								count: number;
							} | null;
							avgEmailsPerDay: number;
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
	"/analytics/latency": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get: {
			parameters: {
				query?: {
					range?: "7d" | "30d" | "90d";
				};
				header?: never;
				path?: never;
				cookie?: never;
			};
			requestBody?: never;
			responses: {
				/** @description Latency percentiles */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							p50: number | null;
							p95: number | null;
							min: number | null;
							max: number | null;
							count: number;
						};
					};
				};
				/** @description Analytics not available on current plan */
				403: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							message: string;
							code: string;
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
								slackSentAt: string | null;
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
							slackSentAt: string | null;
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
	"/inbound/emails/{id}/reply": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		/**
		 * Reply to inbound email
		 * @description Send a reply to an inbound email. Automatically sets threading headers (In-Reply-To, References) and quotes the original message.
		 */
		post: operations["replyToInbound"];
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
					status?:
						| "scheduled"
						| "cancelled"
						| "pending"
						| "sent"
						| "delivered"
						| "bounced"
						| "complained"
						| "failed";
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
								status:
									| "scheduled"
									| "cancelled"
									| "pending"
									| "sent"
									| "delivered"
									| "bounced"
									| "complained"
									| "failed";
								isTest: boolean;
								createdAt: string;
								sentAt: string | null;
								deliveredAt: string | null;
								bouncedAt: string | null;
								latencyMs: number | null;
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
							status:
								| "scheduled"
								| "cancelled"
								| "pending"
								| "sent"
								| "delivered"
								| "bounced"
								| "complained"
								| "failed";
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
							bounceRate: number;
							complaintRate: number;
							trends: {
								sent: {
									value: number;
									/** @enum {string} */
									direction: "up" | "down" | "flat" | "new";
								};
								deliveryRate: {
									value: number;
									/** @enum {string} */
									direction: "up" | "down" | "flat" | "new";
								};
								bounceRate: {
									value: number;
									/** @enum {string} */
									direction: "up" | "down" | "flat" | "new";
								};
								complaintRate: {
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
								status:
									| "pending"
									| "sent"
									| "delivered"
									| "bounced"
									| "complained"
									| "failed";
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
	"/v1/suppressions": {
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
						"application/json": components["schemas"]["SuppressionListResponse"];
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
	"/v1/suppressions/{email}": {
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
	"/v1/domains/{id}/health": {
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
				/** @description Domain health score and factors */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["DomainHealth"];
					};
				};
				/** @description Analytics not available on current plan */
				403: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Error"];
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
	"/v1/domains/{id}/warmup": {
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
				/** @description Domain warmup status */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["DomainWarmup"];
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
	"/v1/domains/{id}/tracking": {
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
				/** @description Tracking configuration for domain */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["TrackingConfig"];
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
		patch: {
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
					"application/json": components["schemas"]["UpdateTrackingConfigRequest"];
				};
			};
			responses: {
				/** @description Updated tracking configuration */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["TrackingConfig"];
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
		trace?: never;
	};
	"/v1/domains/{id}/tracking/domain": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
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
					"application/json": components["schemas"]["SetTrackingDomainRequest"];
				};
			};
			responses: {
				/** @description Updated tracking domain */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["TrackingConfig"];
					};
				};
				/** @description Invalid tracking domain format */
				400: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Error"];
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
		post?: never;
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/v1/domains/{id}/tracking/domain/verify": {
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
				/** @description Tracking domain verification result */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["VerifyTrackingDomainResponse"];
					};
				};
				/** @description No tracking domain configured */
				400: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Error"];
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
							forwardEnabled: boolean;
							webhookEnabled: boolean;
							slackEnabled: boolean;
							forwardTo: string | null;
							webhookUrl: string | null;
							hasSecret: boolean;
							slackWebhookUrl: string | null;
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
						forwardEnabled?: boolean;
						webhookEnabled?: boolean;
						slackEnabled?: boolean;
						/** Format: email */
						forwardTo?: string | null;
						/** Format: uri */
						webhookUrl?: string | null;
						/** Format: uri */
						slackWebhookUrl?: string | null;
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
							forwardEnabled: boolean;
							webhookEnabled: boolean;
							slackEnabled: boolean;
							forwardTo: string | null;
							webhookUrl: string | null;
							hasSecret: boolean;
							slackWebhookUrl: string | null;
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
	"/v1/domains/{id}/inbound/test-webhook": {
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
	"/v1/domains/{id}/inbound/test-slack": {
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
				/** @description Test Slack result */
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
				/** @description Slack not configured */
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
	"/v1/templates/{templateId}": {
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
	"/v1/templates/{templateId}/publish": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		/**
		 * Publish a template
		 * @description Mark template as published. Required before sending emails.
		 */
		post: operations["publishTemplate"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/v1/templates/{templateId}/unpublish": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		/**
		 * Unpublish a template
		 * @description Revert template to draft status.
		 */
		post: operations["unpublishTemplate"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/v1/templates/{templateId}/test": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		/**
		 * Send a test email
		 * @description Send a test email using the template with provided variables.
		 */
		post: operations["testTemplate"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
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
	"/v1/forms": {
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
				/** @description List of forms */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Form"][];
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
					"application/json": components["schemas"]["CreateFormRequest"];
				};
			};
			responses: {
				/** @description Created form */
				201: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Form"];
					};
				};
				/** @description Validation error or domain not verified */
				400: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Error"];
					};
				};
				/** @description Form limit reached */
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
	"/v1/forms/{id}": {
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
				/** @description Form details */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Form"];
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
		patch: {
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
					"application/json": components["schemas"]["UpdateFormRequest"];
				};
			};
			responses: {
				/** @description Updated form */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Form"];
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
	"/public/form/{formId}": {
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
					formId: string;
				};
				cookie?: never;
			};
			requestBody?: {
				content: {
					"application/json": components["schemas"]["SubmitFormRequest"];
				};
			};
			responses: {
				/** @description Submission received */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["SubmitFormSuccess"];
					};
				};
				/** @description Invalid submission */
				400: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Error"];
					};
				};
				/** @description Form not found */
				404: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": components["schemas"]["Error"];
					};
				};
				/** @description Rate limited */
				429: {
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
	"/webhooks/incoming/sns": {
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
	"/webhooks/incoming/sns-inbound": {
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
	"/webhooks/incoming/stripe": {
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
	"/v1/webhooks": {
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
						events: (
							| "email.delivered"
							| "email.bounced"
							| "email.complained"
						)[];
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
	"/v1/webhooks/enable": {
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
						events: (
							| "email.delivered"
							| "email.bounced"
							| "email.complained"
						)[];
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
	"/v1/webhooks/disable": {
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
	"/v1/webhooks/regenerate-secret": {
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
	"/v1/webhooks/test": {
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
	"/v1/webhooks/deliveries": {
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
	"/v1/webhooks/verify": {
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
	"/o/{trackingId}": {
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
					trackingId: string;
				};
				cookie?: never;
			};
			requestBody?: never;
			responses: {
				/** @description Tracking pixel */
				200: {
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
	"/c/{trackingId}": {
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
					trackingId: string;
				};
				cookie?: never;
			};
			requestBody?: never;
			responses: {
				/** @description Redirect to original URL */
				302: {
					headers: {
						[name: string]: unknown;
					};
					content?: never;
				};
				/** @description Link not found */
				404: {
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
	"/public/contact": {
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
					"application/json": components["schemas"]["ContactRequest"];
				};
			};
			responses: {
				/** @description Message sent */
				200: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							/** @enum {boolean} */
							success: true;
						};
					};
				};
				/** @description Invalid request */
				400: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							message: string;
							code: string;
						};
					};
				};
				/** @description Rate limited */
				429: {
					headers: {
						[name: string]: unknown;
					};
					content: {
						"application/json": {
							message: string;
							code: string;
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
}
export type webhooks = Record<string, never>;
export interface components {
	schemas: {
		Alert: {
			id: string;
			domainId: string | null;
			domainName: string | null;
			/** @enum {string} */
			type:
				| "bounce_rate"
				| "complaint_rate"
				| "dns_temp_failure"
				| "dns_failed"
				| "dns_recovered"
				| "inbound_mx_failure"
				| "inbound_mx_recovered"
				| "tracking_cname_failure"
				| "tracking_cname_recovered";
			/** @enum {string} */
			severity: "info" | "warning" | "critical";
			title: string;
			message: string;
			data?: unknown;
			readAt: string | null;
			createdAt: string;
		};
		AlertListResponse: {
			alerts: components["schemas"]["Alert"][];
			unreadCount: number;
		};
		Error: {
			/** @example Invalid request */
			message: string;
			/** @example VALIDATION_ERROR */
			code?: string;
		};
		UnreadCountResponse: {
			count: number;
		};
		MarkAsReadResponse: {
			success: boolean;
		};
		MarkAllAsReadResponse: {
			count: number;
		};
		AlertSettings: {
			bounceThreshold: number;
			complaintThreshold: number;
			emailsEnabled: boolean;
		};
		UpdateAlertSettingsRequest: {
			bounceThreshold?: number;
			complaintThreshold?: number;
			emailsEnabled?: boolean;
		};
		ReplyToInboundResponse: {
			/** @description Inbound email ID */
			id: string;
			/** @description Created reply email ID */
			emailId: string;
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
		ReplyToInboundRequest: {
			/** @description HTML body for the reply */
			html: string;
			/** @description Plain text body (optional, auto-generated from HTML if omitted) */
			text?: string;
			/** @description Subject line. Defaults to 'Re: [original subject]' */
			subject?: string;
			/**
			 * @description Include original CC recipients in reply
			 * @default false
			 */
			includeOriginalCc: boolean;
			/** @description Additional CC recipients */
			additionalCc?: string[];
			/** @description Additional BCC recipients */
			additionalBcc?: string[];
			/** @description File attachments */
			attachments?: components["schemas"]["AttachmentInput"][];
			/** @description Custom email headers */
			headers?: {
				[key: string]: string;
			};
		};
		AttachmentMeta: {
			/** @example invoice.pdf */
			filename: string;
			/** @example 102400 */
			size: number;
			/** @example application/pdf */
			contentType: string;
		};
		Suppression: {
			id: string;
			email: string;
			reason: string;
			sourceEmailId: string | null;
			createdAt: string;
		};
		SuppressionListResponse: {
			data: components["schemas"]["Suppression"][];
			total: number;
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
			inboundEnabled: boolean;
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
			/** Format: email */
			testEmailAddress?: string;
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
		DomainHealth: {
			score: number;
			factors: {
				name: string;
				score: number;
				maxScore: number;
				description: string;
			}[];
			recommendations: string[];
		};
		DomainWarmup: {
			domainAgeDays: number;
			warmupDays: number;
			progress: number;
			recommendedDailyMax?: number;
			currentDailyRate: number;
			isWarmedUp: boolean;
			/** @enum {string} */
			status: "on_track" | "too_fast" | "warmed_up";
			message: string;
		};
		TrackingConfig: {
			openTrackingEnabled: boolean;
			clickTrackingEnabled: boolean;
			privacyMode: boolean;
			trackingDomain: string | null;
			trackingDomainVerified: boolean;
		};
		UpdateTrackingConfigRequest: {
			openTrackingEnabled?: boolean;
			clickTrackingEnabled?: boolean;
			privacyMode?: boolean;
		};
		SetTrackingDomainRequest: {
			trackingDomain: string | null;
		};
		VerifyTrackingDomainResponse: {
			verified: boolean;
			actualCname: string | null;
			config: components["schemas"]["TrackingConfig"];
		};
		TemplateVariable: {
			/** @example name */
			key: string;
			/**
			 * @example string
			 * @enum {string}
			 */
			type: "string" | "number" | "boolean";
			/** @example there */
			fallbackValue?: string;
		};
		/** @description Domain this template is scoped to (null = org-wide) */
		TemplateDomain: {
			/** @example dom_abc123 */
			id: string;
			/** @example example.com */
			name: string;
		} | null;
		Template: {
			/** @example cuid123 */
			id: string;
			/** @example welcome-email */
			templateId: string;
			/** @example Welcome Email */
			name: string | null;
			/** @example Welcome to {{company}}, {{name}}! */
			subject: string;
			/** @description HTML template with {{variable}} placeholders */
			html: string | null;
			/** @description Plain text template with {{variable}} placeholders */
			text: string | null;
			/**
			 * @description Typed variables with optional fallback values
			 * @example [
			 *       {
			 *         "key": "name",
			 *         "type": "string",
			 *         "fallbackValue": "there"
			 *       },
			 *       {
			 *         "key": "company",
			 *         "type": "string"
			 *       }
			 *     ]
			 */
			variables: components["schemas"]["TemplateVariable"][];
			/**
			 * @example draft
			 * @enum {string}
			 */
			status: "draft" | "published";
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
			templateId: string;
			/**
			 * @description Human-readable template name
			 * @example Welcome Email
			 */
			name?: string;
			/**
			 * @description Email subject with optional {{variables}}
			 * @example Welcome to {{company}}!
			 */
			subject: string;
			/** @description HTML body with {{variable}} placeholders */
			html?: string;
			/** @description Plain text body with {{variable}} placeholders */
			text?: string;
			/** @description Typed variables (auto-detected from content if not provided) */
			variables?: components["schemas"]["TemplateVariable"][];
			/**
			 * @description Scope template to a specific domain (omit for org-wide)
			 * @example dom_abc123
			 */
			domainId?: string;
		};
		UpdateTemplateRequest: {
			name?: string | null;
			subject?: string;
			html?: string | null;
			text?: string | null;
			/** @description Typed variables (auto-detected from content if not provided) */
			variables?: components["schemas"]["TemplateVariable"][];
			/** @description Domain to scope template to (null to make org-wide) */
			domainId?: string | null;
		};
		TestTemplateRequest: {
			/**
			 * Format: email
			 * @example test@example.com
			 */
			to: string;
			/**
			 * @description Variable values to substitute
			 * @example {
			 *       "name": "John",
			 *       "company": "Acme"
			 *     }
			 */
			variables?: {
				[key: string]: string;
			};
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
			status:
				| "scheduled"
				| "cancelled"
				| "pending"
				| "sent"
				| "delivered"
				| "bounced"
				| "complained"
				| "failed";
			/**
			 * Format: date-time
			 * @description Scheduled send time (only if scheduled)
			 * @example 2024-01-15T10:00:00Z
			 */
			scheduled_at?: string;
			/** @description List of suppressed recipient addresses (bounced/complained previously) */
			suppressed?: string[];
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
		BatchEmailResult:
			| {
					/** @description Index in request array */
					index: number;
					/** @enum {string} */
					status: "sent";
					/** @example em_abc123 */
					id: string;
					suppressed?: string[];
			  }
			| {
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
			status:
				| "scheduled"
				| "cancelled"
				| "pending"
				| "sent"
				| "delivered"
				| "bounced"
				| "complained"
				| "failed";
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
		Form: {
			id: string;
			domainId: string;
			domainName: string;
			name: string;
			toAddresses: string[];
			subject: string | null;
			replyToSubmitter: boolean;
			redirectUrl: string | null;
			allowedOrigins: string[];
			isActive: boolean;
			createdAt: string;
			updatedAt: string;
		};
		CreateFormRequest: {
			/** @description Domain ID to use */
			domainId: string;
			/** @example contact */
			name: string;
			/** @description Recipients (max 5) */
			toAddresses: string[];
			/**
			 * @description Email subject (default: 'New submission from {name}')
			 * @example New contact form submission
			 */
			subject?: string;
			/**
			 * @description Set Reply-To to submitter's email
			 * @default true
			 */
			replyToSubmitter: boolean;
			/**
			 * Format: uri
			 * @description Redirect URL after submission
			 */
			redirectUrl?: string;
			/**
			 * @description Allowed CORS origins (empty = domain only)
			 * @default []
			 */
			allowedOrigins: string[];
		};
		UpdateFormRequest: {
			name?: string;
			toAddresses?: string[];
			subject?: string | null;
			replyToSubmitter?: boolean;
			/** Format: uri */
			redirectUrl?: string | null;
			allowedOrigins?: string[];
			isActive?: boolean;
		};
		SubmitFormSuccess: {
			/** @enum {boolean} */
			success: true;
		};
		SubmitFormRequest: {
			/**
			 * Format: email
			 * @description Submitter email
			 */
			email: string;
			/** @description Submitter name */
			name?: string;
			/** @description Spam protection - must be empty */
			_honeypot?: string;
		};
		ContactRequest: {
			name: string;
			/** Format: email */
			email: string;
			message: string;
			_honeypot?: string;
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
	listAlerts: {
		parameters: {
			query?: {
				limit?: number;
				offset?: number | null;
			};
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: never;
		responses: {
			/** @description List of alerts */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["AlertListResponse"];
				};
			};
			/** @description Alerts not available on current plan */
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
	getUnreadAlertCount: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: never;
		responses: {
			/** @description Number of unread alerts */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["UnreadCountResponse"];
				};
			};
		};
	};
	markAlertAsRead: {
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
			/** @description Alert marked as read */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["MarkAsReadResponse"];
				};
			};
			/** @description Alert not found */
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
	markAllAlertsAsRead: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: never;
		responses: {
			/** @description Number of alerts marked as read */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["MarkAllAsReadResponse"];
				};
			};
		};
	};
	getAlertSettings: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: never;
		responses: {
			/** @description Alert settings */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["AlertSettings"];
				};
			};
			/** @description Alerts not available on current plan */
			403: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["Error"];
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
	updateAlertSettings: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				"application/json": components["schemas"]["UpdateAlertSettingsRequest"];
			};
		};
		responses: {
			/** @description Updated alert settings */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["AlertSettings"];
				};
			};
			/** @description Alerts not available on current plan */
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
	replyToInbound: {
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
				"application/json": components["schemas"]["ReplyToInboundRequest"];
			};
		};
		responses: {
			/** @description Reply sent successfully */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["ReplyToInboundResponse"];
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
			/** @description Email quota exceeded */
			402: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["Error"];
				};
			};
			/** @description Domain not verified or sending disabled */
			403: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": components["schemas"]["Error"];
				};
			};
			/** @description Inbound email not found */
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
			/** @description Template ID already exists or invalid format */
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
				templateId: string;
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
				templateId: string;
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
				templateId: string;
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
	publishTemplate: {
		parameters: {
			query?: never;
			header?: never;
			path: {
				templateId: string;
			};
			cookie?: never;
		};
		requestBody?: never;
		responses: {
			/** @description Template published */
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
	unpublishTemplate: {
		parameters: {
			query?: never;
			header?: never;
			path: {
				templateId: string;
			};
			cookie?: never;
		};
		requestBody?: never;
		responses: {
			/** @description Template unpublished */
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
	testTemplate: {
		parameters: {
			query?: never;
			header?: never;
			path: {
				templateId: string;
			};
			cookie?: never;
		};
		requestBody?: {
			content: {
				"application/json": components["schemas"]["TestTemplateRequest"];
			};
		};
		responses: {
			/** @description Test email sent */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": {
						/** @example Test email sent */
						message: string;
						/** @example email_abc123 */
						emailId: string;
					};
				};
			};
			/** @description Missing required variables */
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
