import { afterEach, describe, expect, it } from "vitest";
import { addEmail, clearEmails, getEmail, getEmails } from "./storage.js";

describe("storage", () => {
	afterEach(() => {
		clearEmails();
	});

	describe("addEmail", () => {
		it("creates email with id and createdAt", () => {
			const email = addEmail({
				from: "sender@example.com",
				to: "recipient@example.com",
				subject: "Test",
				html: "<p>Hello</p>",
			});

			expect(email.id).toMatch(/^dev_/);
			expect(email.createdAt).toBeInstanceOf(Date);
			expect(email.from).toBe("sender@example.com");
			expect(email.to).toBe("recipient@example.com");
			expect(email.subject).toBe("Test");
		});

		it("stores email in memory", () => {
			addEmail({
				from: "a@b.com",
				to: "c@d.com",
				subject: "Test",
				html: "<p>Hi</p>",
			});

			const emails = getEmails();
			expect(emails).toHaveLength(1);
		});

		it("adds emails at front of list (newest first)", () => {
			addEmail({ from: "a@b.com", to: "x@y.com", subject: "First", html: "" });
			addEmail({ from: "a@b.com", to: "x@y.com", subject: "Second", html: "" });

			const emails = getEmails();
			expect(emails[0].subject).toBe("Second");
			expect(emails[1].subject).toBe("First");
		});

		it("limits to MAX_EMAILS", () => {
			for (let i = 0; i < 110; i++) {
				addEmail({
					from: "a@b.com",
					to: "x@y.com",
					subject: `Email ${i}`,
					html: "",
				});
			}

			const emails = getEmails();
			expect(emails.length).toBeLessThanOrEqual(100);
		});

		it("supports array of recipients", () => {
			const email = addEmail({
				from: "sender@example.com",
				to: ["a@b.com", "c@d.com"],
				subject: "Test",
				text: "Hello",
			});

			expect(email.to).toEqual(["a@b.com", "c@d.com"]);
		});

		it("stores attachments metadata", () => {
			const email = addEmail({
				from: "a@b.com",
				to: "x@y.com",
				subject: "With attachment",
				html: "<p>See attached</p>",
				attachments: [{ filename: "doc.pdf", size: 1024 }],
			});

			expect(email.attachments).toHaveLength(1);
			expect(email.attachments?.[0].filename).toBe("doc.pdf");
		});
	});

	describe("getEmails", () => {
		it("returns copy of emails array", () => {
			addEmail({ from: "a@b.com", to: "x@y.com", subject: "Test", html: "" });

			const emails1 = getEmails();
			const emails2 = getEmails();

			expect(emails1).not.toBe(emails2);
			expect(emails1).toEqual(emails2);
		});

		it("returns empty array when no emails", () => {
			expect(getEmails()).toEqual([]);
		});
	});

	describe("getEmail", () => {
		it("finds email by id", () => {
			const added = addEmail({
				from: "a@b.com",
				to: "x@y.com",
				subject: "Find me",
				html: "",
			});

			const found = getEmail(added.id);
			expect(found).toBeDefined();
			expect(found?.subject).toBe("Find me");
		});

		it("returns undefined for unknown id", () => {
			expect(getEmail("nonexistent")).toBeUndefined();
		});
	});

	describe("clearEmails", () => {
		it("removes all emails", () => {
			addEmail({ from: "a@b.com", to: "x@y.com", subject: "Test", html: "" });
			addEmail({ from: "a@b.com", to: "x@y.com", subject: "Test 2", html: "" });

			expect(getEmails()).toHaveLength(2);

			clearEmails();

			expect(getEmails()).toHaveLength(0);
		});
	});
});
