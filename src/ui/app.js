let emails = [];
let selectedId = null;
let view = "html";

async function fetchEmails() {
	const res = await fetch("/api/emails");
	emails = await res.json();
	renderList();
	document.getElementById("count").textContent =
		`${emails.length} email${emails.length !== 1 ? "s" : ""}`;
}

function timeAgo(date) {
	const seconds = Math.floor((new Date() - new Date(date)) / 1000);
	if (seconds < 60) return "just now";
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	return new Date(date).toLocaleDateString();
}

function escapeHtml(str) {
	if (!str) return "";
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function renderList() {
	const list = document.getElementById("list");
	if (emails.length === 0) {
		list.innerHTML =
			'<p class="empty">No emails yet<br><small>Send an email via SDK to see it here</small></p>';
		return;
	}
	list.innerHTML = emails
		.map(
			(e) => `
    <div class="email-item ${e.id === selectedId ? "active" : ""}" data-id="${e.id}">
      <div class="to">${escapeHtml(Array.isArray(e.to) ? e.to.join(", ") : e.to)}</div>
      <div class="subject">${escapeHtml(e.subject)}</div>
      <div class="time">${timeAgo(e.createdAt)}</div>
    </div>
  `,
		)
		.join("");
}

function renderDetail() {
	const detail = document.getElementById("detail");
	const email = emails.find((e) => e.id === selectedId);
	if (!email) {
		detail.innerHTML =
			'<p class="empty">No email selected<br><small>Send an email to see it here</small></p>';
		return;
	}
	const content =
		view === "html" && email.html
			? `<iframe srcdoc="${escapeHtml(email.html)}"></iframe>`
			: `<pre>${escapeHtml(email.text || email.html || "(no content)")}</pre>`;

	detail.innerHTML = `
    <div class="detail-header">
      <h2>${escapeHtml(email.subject)}</h2>
      <div class="detail-meta">
        <strong>From:</strong> ${escapeHtml(email.from)}<br>
        <strong>To:</strong> ${escapeHtml(Array.isArray(email.to) ? email.to.join(", ") : email.to)}<br>
        <strong>Sent:</strong> ${new Date(email.createdAt).toLocaleString()}
      </div>
    </div>
    <div class="tabs">
      <button class="${view === "html" ? "active" : ""}" data-view="html">HTML</button>
      <button class="${view === "text" ? "active" : ""}" data-view="text">Text</button>
    </div>
    <div class="content">${content}</div>
  `;
}

document.getElementById("list").addEventListener("click", (e) => {
	const item = e.target.closest(".email-item");
	if (item) {
		selectedId = item.dataset.id;
		renderList();
		renderDetail();
	}
});

document.getElementById("detail").addEventListener("click", (e) => {
	if (e.target.dataset.view) {
		view = e.target.dataset.view;
		renderDetail();
	}
});

document.getElementById("clear").addEventListener("click", async () => {
	await fetch("/api/emails", { method: "DELETE" });
	emails = [];
	selectedId = null;
	renderList();
	renderDetail();
	document.getElementById("count").textContent = "0 emails";
});

// Poll for new emails
setInterval(fetchEmails, 2000);
fetchEmails();
